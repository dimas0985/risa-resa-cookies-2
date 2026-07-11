import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Package, Users, ShoppingBag, Trash2, Edit, Save, X, Plus } from 'lucide-react';
import { formatRupiah } from '../utils/shop';

const orderStatuses = [
  { value: 'pending', label: 'Pending - belum potong stok' },
  { value: 'paid', label: 'Paid - stok berkurang' },
  { value: 'shipped', label: 'Shipped - stok berkurang' },
  { value: 'completed', label: 'Completed - stok berkurang' },
  { value: 'cancelled', label: 'Cancelled - stok dikembalikan' },
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderForm, setOrderForm] = useState({ status: 'pending', address: '', payment_method: 'WhatsApp' });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });
  const [error, setError] = useState('');
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user || user.role?.trim().toLowerCase() !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, loading, navigate]);

  const fetchData = async () => {
    setError('');

    const [productRes, orderRes, userRes] = await Promise.allSettled([
      api.get('/products'),
      api.get('/admin/orders'),
      api.get('/admin/users'),
    ]);

    if (productRes.status === 'fulfilled') setProducts(productRes.value.data);
    if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data);
    if (userRes.status === 'fulfilled') setUsers(userRes.value.data);

    const failed = [
      productRes.status === 'rejected' ? 'produk' : '',
      orderRes.status === 'rejected' ? 'pesanan' : '',
      userRes.status === 'rejected' ? 'user' : '',
    ].filter(Boolean);

    if (failed.length) {
      setError(`Gagal mengambil data ${failed.join(', ')}. Pastikan backend sudah direstart dan login sebagai admin.`);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Hapus produk ini?')) {
      await api.delete(`/admin/products/${id}`);
      fetchData();
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: '',
    });
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setShowProductForm(true);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      image: product.image || '',
    });
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image: productForm.image,
      };

      if (editingProductId) {
        await api.put(`/admin/products/${editingProductId}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      resetProductForm();
      setShowProductForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menyimpan produk.');
    }
  };

  const startEditOrder = (order) => {
    setEditingOrderId(order.id);
    setOrderForm({
      status: order.status,
      address: order.address || '',
      payment_method: order.payment_method || 'WhatsApp',
    });
  };

  const cancelEditOrder = () => {
    setEditingOrderId(null);
    setOrderForm({ status: 'pending', address: '', payment_method: 'WhatsApp' });
  };

  const saveOrder = async (id) => {
    await api.put(`/admin/orders/${id}`, orderForm);
    cancelEditOrder();
    fetchData();
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Hapus pesanan ini dari database?')) {
      await api.delete(`/admin/orders/${id}`);
      fetchData();
    }
  };

  const customerCount = users.filter((registeredUser) => registeredUser.role !== 'admin').length;
  const revenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + Number(order.total_price || 0), 0);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-6 text-center font-semibold text-gray-600 shadow-sm">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Admin</h2>
        <p className="text-gray-500 mt-2">Kelola produk, pesanan, pelanggan, dan status transaksi Risa Resa Cookies.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-lg"><Package size={30} /></div>
          <div><p className="text-gray-500">Produk</p><p className="text-2xl font-bold">{products.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg"><ShoppingBag size={30} /></div>
          <div><p className="text-gray-500">Pesanan</p><p className="text-2xl font-bold">{orders.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-lg"><Users size={30} /></div>
          <div><p className="text-gray-500">Pelanggan</p><p className="text-2xl font-bold">{customerCount}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500">Omzet Tercatat</p>
          <p className="text-2xl font-bold text-amber-600">{formatRupiah(revenue)}</p>
        </div>
      </div>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold">Kelola Produk</h3>
          <button
            type="button"
            onClick={() => setShowProductForm((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-600 px-4 py-2 font-bold text-white transition hover:bg-amber-700"
          >
            {showProductForm ? <X size={18} /> : <Plus size={18} />}
            {showProductForm ? 'Tutup Form' : 'Tambah Produk'}
          </button>
        </div>

        {showProductForm && (
          <form onSubmit={saveProduct} className="mb-6 rounded-lg border border-amber-100 bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-bold text-gray-800">
              {editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Nama Produk</label>
                <input
                  className="w-full rounded-md border px-3 py-2 focus:border-amber-500 focus:ring-amber-500"
                  value={productForm.name}
                  onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Path Gambar</label>
                <input
                  className="w-full rounded-md border px-3 py-2 focus:border-amber-500 focus:ring-amber-500"
                  value={productForm.image}
                  onChange={(event) => setProductForm({ ...productForm, image: event.target.value })}
                  placeholder="uploads/products/Nama-File.jpg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Harga</label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border px-3 py-2 focus:border-amber-500 focus:ring-amber-500"
                  value={productForm.price}
                  onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Stok</label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border px-3 py-2 focus:border-amber-500 focus:ring-amber-500"
                  value={productForm.stock}
                  onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">Deskripsi</label>
                <textarea
                  className="w-full rounded-md border px-3 py-2 focus:border-amber-500 focus:ring-amber-500"
                  rows="3"
                  value={productForm.description}
                  onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetProductForm();
                  setShowProductForm(false);
                }}
                className="rounded-md border border-gray-200 px-4 py-2 font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-600 px-4 py-2 font-bold text-white transition hover:bg-amber-700"
              >
                <Save size={18} /> {editingProductId ? 'Update Produk' : 'Simpan Produk'}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 font-semibold">{product.name}</td>
                  <td className="px-6 py-4">{formatRupiah(product.price)}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4 flex gap-4">
                    <button onClick={() => startEditProduct(product)} className="text-blue-600 hover:text-blue-800" title="Edit produk"><Edit size={18} /></button>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-800" title="Hapus produk"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-5">CRUD Pemesanan</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left align-top">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4">Pesanan</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => {
                const isEditing = editingOrderId === order.id;

                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold">#ORD-{order.id}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                      {isEditing ? (
                        <textarea
                          className="mt-3 w-56 rounded-md border px-3 py-2 text-sm"
                          rows="3"
                          value={orderForm.address}
                          onChange={(event) => setOrderForm({ ...orderForm, address: event.target.value })}
                        />
                      ) : (
                        <p className="mt-2 max-w-xs text-sm text-gray-600">{order.address || '-'}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{order.user?.name || '-'}</p>
                      <p className="text-sm text-gray-500">{order.user?.email || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {(order.order_items || []).map((item) => (
                          <div key={item.id} className="text-sm">
                            <p className="font-semibold">{item.product?.name || `Produk #${item.product_id}`}</p>
                            <p className="text-gray-500">
                              {item.quantity} x {formatRupiah(item.price)} = {formatRupiah(item.total_price || item.quantity * item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-600">{formatRupiah(order.total_price)}</td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <select
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={orderForm.status}
                            onChange={(event) => setOrderForm({ ...orderForm, status: event.target.value })}
                          >
                            {orderStatuses.map((status) => (
                              <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                          </select>
                          <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={orderForm.payment_method}
                            onChange={(event) => setOrderForm({ ...orderForm, payment_method: event.target.value })}
                          />
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        {order.stock_applied ? 'Stok sudah dipotong' : 'Stok belum dipotong'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex gap-3">
                          <button onClick={() => saveOrder(order.id)} className="text-green-600 hover:text-green-800" title="Simpan pesanan"><Save size={19} /></button>
                          <button onClick={cancelEditOrder} className="text-gray-500 hover:text-gray-800" title="Batal"><X size={19} /></button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button onClick={() => startEditOrder(order)} className="text-blue-600 hover:text-blue-800" title="Edit pesanan"><Edit size={18} /></button>
                          <button onClick={() => deleteOrder(order.id)} className="text-red-600 hover:text-red-800" title="Hapus pesanan"><Trash2 size={18} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-5">User Terdaftar</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((registeredUser) => (
                <tr key={registeredUser.id}>
                  <td className="px-6 py-4 font-semibold">{registeredUser.name}</td>
                  <td className="px-6 py-4">{registeredUser.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      registeredUser.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {registeredUser.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
