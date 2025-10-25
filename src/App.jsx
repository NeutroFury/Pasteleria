import './styles/style.css';
import Admin from './pages/Admin.jsx';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import { Routes, Route, NavLink } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Blogs from './pages/Blogs';
import Carrito from './pages/Carrito';
import Contacto from './pages/Contacto';
import Dato1 from './pages/Dato1';
import Dato2 from './pages/Dato2';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Registro from './pages/Registro';
import { useLocation } from 'react-router-dom';
import AdminUsuarios from './pages/Admin-usuarios.jsx';
import AdminProductos from './pages/Admin-productos.jsx';
import Ofertas from './pages/Ofertas.jsx';
import Checkout from './pages/Checkout.jsx';
import PagoBien from './pages/Pago-bien.jsx';
import PagoMal from './pages/Pago-mal.jsx';


function App() {
  const location = useLocation();
  // Modificamos la lógica para incluir también la ruta admin-usuarios
  const hideLayout = ['/admin', '/admin-usuarios','/admin-productos'].includes(location.pathname);

  return (
    <div className="App">
      {!hideLayout && <Header/>}
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-usuarios" element={<AdminUsuarios />} />
        <Route path="/admin-productos" element={<AdminProductos />} />
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs/>} />
  <Route path="/ofertas" element={<Ofertas/>} />
  <Route path="/checkout" element={<Checkout/>} />
  <Route path="/pago-bien" element={<PagoBien/>} />
  <Route path="/pago-mal" element={<PagoMal/>} />
        <Route path='/carrito' element={<Carrito/>} />
        <Route path="/contacto" element={<Contacto/>} />
        <Route path="/dato1" element={<Dato1/>} />
        <Route path="/dato2" element={<Dato2/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/productos" element={<Productos/>} />
        <Route path="/registro" element={<Registro/>} />
      </Routes>
      {!hideLayout && <Footer/>}
    </div>
  );
}

export default App;
