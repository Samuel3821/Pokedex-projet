import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function DetailPokemon() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    // Prendre le Pokemon choisi par l'utilisateur
    const fetchPokemon = async (id) => {
        try {
            const response = await fetch(`https://Tyradex.app/api/v1/pokemon/${id}`);
            const data = await response.json();
            setPokemon(data);
        } catch (error) {
            console.error('Error fetching the Pokémon:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPokemon(id);
        }
    }, [id]);

    if (!pokemon) {
        return <div>Loading...</div>;
    }
    // Affichage du pokemon 
    return (
        <div className="container">
            <div className="content">
                <h1>Détail de {pokemon.name.fr}</h1>
                <img src={pokemon.sprites.regular} alt={pokemon.name.fr} className='image' />
                <table className="tableau">
                    <thead>
                        <tr>
                            <th>Types</th>
                            <th>categorie</th>
                            <th>talents</th>
                            <th>stats</th>
                            {pokemon.evolution?.next?.length > 0 && <th>evolution</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {pokemon.types.map((type) => (
                                    <span key={type.name}>
                                        {type.name} <br/><img src={type.image} alt={type.name} />
                                        <br/>
                                    </span>
                                ))}
                            </td>
                            <td>{pokemon.category}</td>
                            <td>
                                <ul>
                                    {pokemon.talents.map((ability) => (
                                <li key={ability.name}>{ability.name}</li>
                                
                                ))}
                                </ul></td>
                            <td>
                                <ul>
                                    {Object.entries(pokemon.stats).map(([statName, statValue]) => (
                                        <li key={statName}>
                                        {statName}: {statValue}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            {pokemon.evolution?.next?.length > 0 &&
                            <td>
                                <ul>
                                {pokemon.evolution?.next?.map((evolution) => (
                                    <li key={evolution.pokedex_id}>
                                        {evolution.name} {evolution.condition ? 
                                        (evolution.condition.startsWith('Niveau') ? `au niveau : ${evolution.condition.split(' ')[1]}` : `évolue avec : ${evolution.condition}`) : ''}
                                    </li>
                                ))}
                                </ul>
                            </td>}
                        </tr>
                    </tbody>
                </table>
                
            </div>
        </div>
    );
}