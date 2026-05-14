import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ListePokemon.css';

export function ListePokemon() {
    //constantes
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState('');
    const [filteredPokemonList, setFilteredPokemonList] = useState([]);
    //Recherche des pokemon (generation 1)
    const fetchPokemon = async () => {
        try {
            const response = await fetch(`https://Tyradex.app/api/v1/gen/1`);
            const data = await response.json();
            setPokemonList(data);
        } catch (error) {
            console.error('Error fetching the Pokémon:', error);
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, []);
    //Filtres pokemon
    useEffect(() => {
        if (selectedLetter === '') {
            setFilteredPokemonList(pokemonList);
        } else {
            setFilteredPokemonList(pokemonList.filter(pokemon => pokemon.name.fr.toLowerCase().startsWith(selectedLetter.toLowerCase())));
        }
    }, [selectedLetter, pokemonList]);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    //Affichage (selon filtre)
    return (
        <div className="container">
            <div className="content">
                <h1>Liste des Pokémons</h1>
                <button onClick={() => setSelectedLetter("")}>Reset</button>
                <div className="alphabet-filter">
                    {alphabet.map(letter => (
                        <button key={letter} onClick={() => setSelectedLetter(letter.toLowerCase())}>
                            {letter}
                        </button>
                    ))}
                </div>
                <table className="tableau">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Types</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPokemonList.map((pokemon) => (
                            <tr key={pokemon.pokedex_id}>
                                <td>
                                    <Link to={`/pokemon/${pokemon.pokedex_id}`}>
                                        <img src={pokemon.sprites.regular} alt={pokemon.name.fr} className='image' />
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/pokemon/${pokemon.pokedex_id}`}>
                                        {pokemon.name.fr}
                                    </Link>
                                </td>
                                <td>{pokemon.types.map(type => type.name).join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
