import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function QuizzQuestion({ onScoreUpdate, user }) {
    const [pokemonATrouver, setPokemonATrouver] = useState('');
    const [pokemonImageATrouver, setPokemonImageATrouver] = useState('');
    const [choices, setChoices] = useState([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const fetchPokemon = async (id) => {
        try {
            const response = await fetch(`https://Tyradex.app/api/v1/pokemon/${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching the Pokémon:', error);
        }
    };
    // Génération du choix a trouver entre les 151 de bases
    const generateChoices = async (correctPokemon) => {
        const choices = [correctPokemon];
        while (choices.length < 4) {
            const randomId = Math.floor(Math.random() * 151) + 1;
            const pokemon = await fetchPokemon(randomId);
            if (!choices.some(choice => choice.pokedex_id === pokemon.pokedex_id)) {
                choices.push(pokemon);
            }
        }
        setChoices(shuffleArray(choices));
    };
    // Les réponses sont randomisé (avec la bonne car il faut pas mettre la réponse toujours au même endroit
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const startGame = async () => {
        const randomId = Math.floor(Math.random() * 151) + 1;
        const correctPokemon = await fetchPokemon(randomId);
        setPokemonATrouver(correctPokemon.name.fr);
        setPokemonImageATrouver(correctPokemon.sprites.regular);
        await generateChoices(correctPokemon);
    };

    const handleChoiceClick = async (choice) => {
        if (choice.name.fr === pokemonATrouver) {
            const newScore = score + 1;
            setScore(newScore);
            onScoreUpdate(newScore);
            startGame();
        } else {
            setGameOver(true);

            // Vérifiez si l'utilisateur est défini avant d'essayer d'utiliser user.uid
            if (user) {
                const bestScoreDoc = doc(db, 'scores', user.uid);
                const bestScoreSnapshot = await getDoc(bestScoreDoc);
                const bestScoreData = bestScoreSnapshot.data();
                const newBestScore = Math.max(score, bestScoreData?.bestScore || 0);

                // Utilisez merge: true pour ne pas écraser les autres données comme displayName
                await setDoc(bestScoreDoc, { bestScore: newBestScore }, { merge: true });

                setBestScore(newBestScore);
                onScoreUpdate(newBestScore);
            } else {
                console.error('Utilisateur non connecté.');
            }
        }
    };

    const handleRestart = () => {
        setScore(0);
        onScoreUpdate(0);
        setGameOver(false);
        startGame();
    };

    useEffect(() => {
        // Assurez-vous que l'utilisateur est connecté avant de tenter d'accéder à user.uid
        if (user) {
            const fetchBestScore = async () => {
                const bestScoreDoc = doc(db, 'scores', user.uid);
                const bestScoreSnapshot = await getDoc(bestScoreDoc);
                const bestScoreData = bestScoreSnapshot.data();
                setBestScore(bestScoreData?.bestScore || 0);
            };

            fetchBestScore();
            startGame();
        }
    }, [user]); // Exécuter cette logique seulement si l'utilisateur est défini

    return (
        <div className="questionnaire">
            {gameOver ? (
                <div>
                    <p>Game Over! Votre score : {score}</p>
                    <button onClick={handleRestart}>Recommencer</button>
                </div>
            ) : (
                <div>
                    <img src={pokemonImageATrouver} alt={pokemonATrouver} className="pokemon-image" />
                    <div className="choices">
                        {choices.map(choice => (
                            <button key={choice.pokedex_id} onClick={() => handleChoiceClick(choice)}>
                                {choice.name.fr}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
