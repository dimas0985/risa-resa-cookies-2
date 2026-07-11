import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      await api.post('/register', { name, email, password });
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data && (error.response.data.message || error.response.data.error)) {
        setError(error.response.data.message || error.response.data.error);
      } else {
        setError('Pendaftaran gagal. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">Daftar</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nama Lengkap</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Sudah punya akun? <Link to="/login" className="text-amber-600 font-bold">Login di sini</Link>
      </p>
    </div>
  );
};

export default Register;
