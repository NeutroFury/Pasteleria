/**
 * 🧾 Archivo de lógica pura para el componente Login.
 * Ubicación sugerida: src/utils/Login.logic.js  
 * * Este archivo debe ser importado en el componente React antes de su uso .
 */

import api from '../services/api';

// Evitar redeclaración
if (!window.LoginLogic) window.LoginLogic = {};

window.LoginLogic.handleLoginSubmit = async function (
  e,
  email,
  password,
  location,
  navigate,
  setMsg
) {
  e.preventDefault();
  setMsg('');

  try {
    const res = await api.login(email, password);
    // backend should return token and optionally user info
    const name = res?.username || res?.name || email.split('@')[0] || 'Usuario';
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    if (res?.token) localStorage.setItem('token', res.token);

    window.dispatchEvent(new Event('auth-changed'));
    const to = location.state?.from || '/';
    navigate(to);
  } catch (err) {
    console.error('Login error', err);
    setMsg(err?.message || 'Error autenticando');
  }
};
