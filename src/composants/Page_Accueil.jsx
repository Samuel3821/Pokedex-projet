import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Page_Accueil() {
    const [count, setCount] = useState(0);
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonImage, setPokemonImage] = useState('');
  //Recherche pokemon via le lien API
  const fetchPokemon = async (id) => {
    try {
      const response = await fetch(`https://Tyradex.app/api/v1/pokemon/${id}`);
      const data = await response.json();
      setPokemonName(data.name.fr);
      setPokemonImage(data.sprites.regular);

    } catch (error) {
      console.error('Error fetching the Pokémon:', error);
    }
  };
  // dès que l'utilisateur clique = prend un chiffre aléatoire entre 1 et 151
  const handleClick = () => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    setCount(randomId);
    fetchPokemon(randomId);
  };

  useEffect(() => {
    if (count > 0) {
      fetchPokemon(count);
    }
  }, [count]);
  //affichage
  return (
    <div className="container">
      <div className="content">
          <h1>PokéQuiz</h1>
        <h2>Bienvenue sur le Pokesite de la première et la meilleure génération Pokemon</h2>
        <button onClick={handleClick} className="allbutton">
          Selectionner un Pokemon aléatoire
          </button>
          {pokemonName && (
                <div>
                    <Link to={`/pokemon/${count}`}>
                        <h2>{pokemonName}</h2>
                        <img src={pokemonImage} alt={pokemonName} />
                    </Link>
                </div>
            )}
        </div>
      </div>
);
}