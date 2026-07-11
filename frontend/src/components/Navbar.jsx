import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role?.trim().toLowerCase() === 'admin';

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-amber-600">
          Risa Resa Cookies
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/products" className="text-gray-600 hover:text-amber-600">Katalog</Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-amber-600">
            <ShoppingCart size={24} />
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link to="/admin" className="text-gray-600 hover:text-amber-600 font-semibold">Dashboard</Link>
              )}
              <span className="text-gray-600 flex items-center gap-1">
                <User size={20} /> {user.name}
              </span>
              <button onClick={logout} className="text-gray-600 hover:text-red-600">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
