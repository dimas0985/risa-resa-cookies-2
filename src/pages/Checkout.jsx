import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { resolveProductImage } from '../data/productCatalog';
import { buildWhatsAppOrderUrl, formatRupiah } from '../utils/shop';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const paymentMethod = 'WhatsApp';
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk checkout.');
      navigate('/login');
      return;
    }
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, [user, navigate]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderItems = cartItems.map(item => ({
        product_id: Number(item.id),
        quantity: item.quantity
      }));

      const canSaveOrder = orderItems.every((item) => Number.isInteger(item.product_id) && item.product_id > 0);

      if (!canSaveOrder) {
        alert('Data produk di keranjang belum valid. Silakan hapus produk lama dari keranjang lalu tambahkan ulang dari katalog.');
        return;
      }

      const whatsappUrl = buildWhatsAppOrderUrl({
        items: cartItems,
        totalPrice,
        address,
        paymentMethod,
        customerName: user?.name,
      });

      await api.post('/orders', {
        address,
        payment_method: paymentMethod,
        items: orderItems
      });

      localStorage.removeItem('cart');
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      alert('Pesanan berhasil dibuat! Silakan lanjutkan konfirmasi pembayaran di WhatsApp.');
      navigate('/');
    } catch (err) {
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Keranjang Anda Kosong</h2>
        <p className="text-gray-600">Silakan tambahkan produk ke keranjang terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Informasi Pengiriman</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Nama Penerima</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md bg-gray-50" value={user?.name} disabled />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Alamat Lengkap</label>
              <textarea 
                className="w-full px-4 py-2 border rounded-md focus:ring-amber-500 focus:border-amber-500" 
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Masukkan alamat pengiriman lengkap..."
              ></textarea>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Metode Pembayaran</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700"
                value="WhatsApp"
                disabled
              />
              <p className="mt-2 text-sm text-gray-500">Pesanan akan diarahkan ke WhatsApp 087869198381.</p>
            </div>
            <button type="submit" className="w-full bg-amber-600 text-white py-4 rounded-md font-bold hover:bg-amber-700 transition">
              Buat Pesanan & Lanjut ke WA
            </button>
          </form>
        </div>
        
        <div className="bg-amber-50 p-8 rounded-xl h-fit border border-amber-100">
          <h3 className="text-xl font-bold mb-6">Ringkasan Pesanan</h3>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-4">
                <img 
                  src={resolveProductImage(item.image)} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-md border border-amber-200"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/64' }}
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} x {formatRupiah(item.price)}</p>
                </div>
                <p className="font-bold">{formatRupiah(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-amber-200 pt-4 mt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Pembayaran</span>
              <span className="text-amber-700">{formatRupiah(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
