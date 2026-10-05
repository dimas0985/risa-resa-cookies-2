import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { resolveProductImage } from '../data/productCatalog';
import { buildWhatsAppOrderUrl, formatRupiah } from '../utils/shop';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
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

  const paymentOptions = [
    {
      id: 'DANA',
      label: 'DANA',
      subtitle: 'Pembayaran via DANA',
      accent: 'bg-emerald-500',
    },
    {
      id: 'MANDIRI',
      label: 'Bank Mandiri',
      subtitle: 'Transfer ke rekening Bank Mandiri',
      accent: 'bg-blue-600',
    },
    {
      id: 'BCA',
      label: 'Bank BCA',
      subtitle: 'Transfer ke rekening Bank BCA',
      accent: 'bg-sky-600',
    },
  ];

  const qrCells = Array.from({ length: 144 }, (_, index) => {
    const row = Math.floor(index / 12);
    const col = index % 12;
    const isFinder =
      (row < 4 && col < 4) ||
      (row < 4 && col > 7) ||
      (row > 7 && col < 4);

    const isCenterPattern =
      (row >= 2 && row <= 5 && col >= 2 && col <= 5) ||
      (row >= 2 && row <= 5 && col >= 6 && col <= 9) ||
      (row >= 6 && row <= 9 && col >= 2 && col <= 5);

    const isFilled =
      isFinder ||
      (row >= 2 && row <= 9 && col >= 2 && col <= 9 && ((row + col) % 2 === 0 || (row % 3 === 0 && col % 2 === 0))) ||
      (row > 10 && col > 10 && (row + col) % 3 === 0) ||
      (isCenterPattern && ((row + col) % 2 === 0));

    return { row, col, isFilled };
  });

  const paymentLabelMap = {
    DANA: 'DANA',
    MANDIRI: 'Bank Mandiri',
    BCA: 'Bank BCA',
  };

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

      const selectedPaymentLabel = paymentLabelMap[paymentMethod] || paymentMethod;
      const whatsappUrl = buildWhatsAppOrderUrl({
        items: cartItems,
        totalPrice,
        address,
        paymentMethod: selectedPaymentLabel,
        customerName: user?.name,
      });

      await api.post('/orders', {
        address,
        payment_method: paymentMethod,
        items: orderItems
      });

      localStorage.removeItem('cart');
      alert('Pesanan berhasil dibuat! Anda akan diarahkan ke WhatsApp.');
      window.location.assign(whatsappUrl);
    } catch (err) {
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">Keranjang Anda Kosong</h2>
        <p className="text-gray-600">Silakan tambahkan produk ke keranjang terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="mb-8 text-3xl font-bold text-center">Checkout</h2>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <h3 className="mb-6 text-xl font-bold">Informasi Pengiriman</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Nama Penerima</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md bg-gray-50" value={user?.name} disabled />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Alamat Lengkap</label>
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
              <label className="block mb-3 font-semibold text-gray-700">Metode Pembayaran</label>
              <div className="space-y-3">
                {paymentOptions.map((option) => {
                  const isSelected = paymentMethod === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-200'
                          : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold text-white ${option.accent}`}>
                          {option.id === 'DANA' ? 'D' : option.id === 'MANDIRI' ? 'M' : 'B'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{option.label}</span>
                            {isSelected && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                Dipilih
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{option.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                {paymentMethod === 'DANA' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 text-lg font-bold text-white">
                        D
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Transfer DANA</p>
                        <p className="text-sm text-gray-600">Pembayaran dilakukan ke nomor DANA resmi toko.</p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-lg border border-emerald-200 bg-white p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">E-Wallet</span>
                        <span className="font-semibold text-gray-800">DANA</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">No. DANA</span>
                        <span className="font-semibold text-gray-800">087869198381</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">Atas Nama</span>
                        <span className="font-semibold text-gray-800">Muhammad Dimas Ardhiansyah</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Transfer sesuai nominal <span className="font-semibold text-gray-700">{formatRupiah(totalPrice)}</span> lalu kirim bukti transfer via WhatsApp untuk konfirmasi pesanan.
                    </p>
                  </div>
                ) : paymentMethod === 'MANDIRI' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
                        M
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Transfer Bank Mandiri</p>
                        <p className="text-sm text-gray-600">Pembayaran dilakukan ke rekening resmi toko.</p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-lg border border-blue-200 bg-white p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">Bank</span>
                        <span className="font-semibold text-gray-800">Mandiri</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">No. Rekening</span>
                        <span className="font-semibold text-gray-800">1270011100300</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">Atas Nama</span>
                        <span className="font-semibold text-gray-800">Muhammad Dimas Ardhiansyah</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Transfer sesuai nominal <span className="font-semibold text-gray-700">{formatRupiah(totalPrice)}</span> lalu kirim bukti transfer via WhatsApp untuk konfirmasi pesanan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-600 text-lg font-bold text-white">
                        B
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-sky-700">Transfer Bank BCA</p>
                        <p className="text-sm text-gray-600">Pembayaran dilakukan ke rekening resmi toko.</p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-lg border border-sky-200 bg-white p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">Bank</span>
                        <span className="font-semibold text-gray-800">BCA</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">No. Rekening</span>
                        <span className="font-semibold text-gray-800">0710298530</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">Atas Nama</span>
                        <span className="font-semibold text-gray-800">Muhammad Dimas Ardhiansyah</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Transfer sesuai nominal <span className="font-semibold text-gray-700">{formatRupiah(totalPrice)}</span> lalu kirim bukti transfer via WhatsApp untuk konfirmasi pesanan.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="w-full py-4 font-bold text-white transition rounded-md bg-amber-600 hover:bg-amber-700">
              Buat Pesanan & Lanjut ke WA
            </button>
          </form>
        </div>
        
        <div className="p-8 border bg-amber-50 rounded-xl h-fit border-amber-100">
          <h3 className="mb-6 text-xl font-bold">Ringkasan Pesanan</h3>
          <div className="mb-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <img 
                  src={resolveProductImage(item.image)} 
                  alt={item.name} 
                  className="object-cover w-16 h-16 border rounded-md border-amber-200"
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
          <div className="pt-4 mt-4 border-t border-amber-200">
            <div className="flex items-center justify-between text-xl font-bold">
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
