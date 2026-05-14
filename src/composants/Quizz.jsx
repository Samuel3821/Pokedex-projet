import { useState, useEffect } from 'react';
import { QuizzQuestion } from './QuizzQuestion';
import { db, auth, googleProvider } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import './Quizz.css';

export function Quizz() {
    const [bestScore, setBestScore] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [user, setUser] = useState(null);
    const [scores, setScores] = useState([]);
    const [userDisplayName, setUserDisplayName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setUserDisplayName(user.displayName.split(' ')[0]); // Extraire le prénom
                fetchBestScore(user.uid);
                saveUserToFirestore(user);
            } else {
                setUser(null);
            }
        });

        fetchBestScores(); // Afficher score au lancement

        return () => unsubscribe();
    }, []);

    const saveUserToFirestore = async (user) => {
        const userDoc = doc(db, 'scores', user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            // Créez un document pour l'utilisateur s'il n'existe pas encore
            await setDoc(userDoc, {
                bestScore: 0,
                displayName: user.displayName.split(' ')[0] || 'Utilisateur inconnu', // Enregistrer seulement le prénom
            });
        }
    };
    //Liste des scores
    const fetchBestScores = async () => {
        try {
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);
            const scoresData = scoresSnapshot.docs.map(doc => doc.data());
            console.log('Scores récupérés:', scoresData); // Ajoutez ce log pour vérifier les données
            scoresData.sort((a, b) => b.bestScore - a.bestScore);
            setScores(scoresData.slice(0, 5));
        } catch (error) {
            console.error('Erreur lors de la récupération des scores:', error);
        }
    };
    //Le meilleur score de l'utilisateur
    const fetchBestScore = async (uid) => {
        const bestScoreDoc = doc(db, 'scores', uid);
        const bestScoreSnapshot = await getDoc(bestScoreDoc);
        const bestScoreData = bestScoreSnapshot.data();
        setBestScore(bestScoreData?.bestScore || 0);
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            setUser(user);
            const firstName = user.displayName.split(' ')[0]; // Extraire le prénom
            setUserDisplayName(firstName);
            fetchBestScore(user.uid);
            await saveUserToFirestore({ ...user, displayName: firstName }); // Enregistrer seulement le prénom
        } catch (error) {
            console.error("Erreur lors de la connexion avec Google :", error);
        }
    };

    const handleGoogleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setBestScore(0);
            setCurrentScore(0);
            setShowQuestion(false); // Utiliser setShowQuestion pour mettre à jour l'état
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    const handleStart = () => {
        if (user) {
            setShowQuestion(true);
        }
    };
    //Mettre a jour le score sur firestore en cas de score battu
    const handleScoreUpdate = async (newScore) => {
        setCurrentScore(newScore);
        if (newScore > bestScore) {
            setBestScore(newScore);
            if (user) {
                const userDoc = doc(db, 'scores', user.uid);
                await setDoc(userDoc, { bestScore: newScore }, { merge: true });
                fetchBestScores(); // Mettre à jour les meilleurs scores
            }
        }
        const podiumScores = scores.slice(0, 3).map(score => score.bestScore);
        // Petits messages pour encourager l'utilisateur
        if (newScore >= bestScore - 3 && newScore <= bestScore && bestScore > 0) {
            setMessage(`Vous êtes à ${bestScore - newScore + 1} points de battre votre meilleur score !`);
        } else if (newScore > bestScore) {
            setMessage("Vous avez battu votre meilleur score ! Continuez comme ça !");
        } else {
            setMessage('');
        }

        // Vérifier si l'utilisateur est sur le podium
        
        if (newScore >= Math.min(...podiumScores)) {
            setMessage(prevMessage => prevMessage + " Vous êtes sur le podium !");
        }
    };

    return (
        <div className="container">
            <div className="content">
                <h1>Quiz Pokemon</h1>
                <h2>Testez vos connaissances sur les Pokemons</h2>
                {!user && (
                    <button onClick={handleGoogleSignIn}>
                        Se connecter avec Google
                    </button>
                )}
                {user && (
                    <div>
                        <p>Bienvenue, {userDisplayName}!</p>
                        <button onClick={handleGoogleSignOut}>
                            Déconnexion
                        </button>
                    </div>
                )}
                <h3>Meilleurs scores</h3>
                <div className="scores-container">
                    <ol>
                        {scores.map((score, index) => (
                            <li key={index}>
                                {score.displayName}: {score.bestScore}
                            </li>
                        ))}
                    </ol>
                </div>
                {!showQuestion && user && (
                    <div>
                    <button onClick={handleStart}>Commencer</button>
                    </div>
                )}
                {// Je l'ai mis ici car le boutton commencer s'enlèvera une fois que le quizz sera lancé 
                }
                {user && (
                    <div>
                    <p>Score actuel : {currentScore}</p>
                    <p>{message}</p>
                    </div>
                )}
                {showQuestion && (
                    <QuizzQuestion
                        onScoreUpdate={handleScoreUpdate}
                        user={user}
                    />
                )}
            </div>
        </div>
    );
}
