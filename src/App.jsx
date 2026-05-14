import './App.css';
import { Page_Accueil } from './composants/Page_Accueil';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ListePokemon } from './composants/ListePokemon';
import { Quizz } from './composants/Quizz';
import { DetailPokemon } from './composants/DetailPokemon';
import {Footer} from './composants/Footer';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <img src="./src/assets/pokedex.png" alt="pokedex" className="image-menu" />
        <Link to="/"><button>Page d'accueil</button></Link>
        <Link to="/pokemons"><button>Liste des pokemons</button></Link>
        <Link to="/quizz"><button>Quiz</button></Link>
        <img src="./src/assets/pikachu.jpg" alt="pokedex" className="image-menu" />
      </nav>
      <Routes>
        <Route path="/" element={<Page_Accueil />} />
        <Route path="/pokemons" element={<ListePokemon />} />
        <Route path="/quizz" element={<Quizz />} />
        <Route path="/pokemon/:id" element={<DetailPokemon />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;