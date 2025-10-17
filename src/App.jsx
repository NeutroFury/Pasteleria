import './styles/style.css';
import Home from './components/Home';
import Nosotros from './components/Nosotros';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Blogs from './pages/Blogs';
import Carrito from './pages/Carrito';
import Contacto from './pages/Contacto';
import Dato1 from './pages/Dato1';
import Dato2 from './pages/Dato2';
import Index from './pages/Index';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Registro from './pages/Registro';


function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs/>} />
        <Route path='/carrito' element={<Carrito/>} />
        <Route path="/contacto" element={<Contacto/>} />
        <Route path="/dato1" element={<Dato1/>} />
        <Route path="/dato2" element={<Dato2/>} />
        <Route path="/index" element={<Index/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/productos" element={<Productos/>} />
        <Route path="/registro" element={<Registro/>} />

      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
