import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { resolveProductImage } from '../data/productCatalog';
import { formatRupiah } from '../utils/shop';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Keranjang Belanja</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6 text-xl">Keranjang Anda kosong.</p>
          <Link to="/products" className="bg-amber-600 text-white px-8 py-3 rounded-md font-bold hover:bg-amber-700 transition">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <img src={resolveProductImage(item.image)} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="ml-6 flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-amber-600 font-bold">{formatRupiah(item.price)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-100"><Minus size={16} /></button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-100"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-xl font-bold mb-6">Ringkasan Pesanan</h3>
            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              <span className="font-bold">{formatRupiah(totalPrice)}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-8">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-amber-600">{formatRupiah(totalPrice)}</span>
              </div>
              <Link to="/checkout" className="block w-full text-center bg-amber-600 text-white py-4 rounded-md font-bold hover:bg-amber-700 transition">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
