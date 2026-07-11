import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const res = await api.post('/login', { email: identifier.trim(), username: identifier.trim(), password });
      login(res.data.user, res.data.token);
      navigate(res.data.user?.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      if (error.response && error.response.data && (error.response.data.message || error.response.data.error)) {
        setError(error.response.data.message || error.response.data.error);
      } else {
        setError('Login gagal. Periksa kembali email dan password Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email atau Nama</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-amber-600 text-white py-3 rounded-md font-bold hover:bg-amber-700 transition" disabled={loading}>
          {loading ? 'Masuk...' : 'Login'}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Belum punya akun? <Link to="/register" className="text-amber-600 font-bold">Daftar sekarang</Link>
      </p>
    </div>
  );
};

export default Login;
