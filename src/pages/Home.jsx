import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { catalogProducts, resolveProductImage } from '../data/productCatalog';
import { Eye, MessageCircle, ShoppingCart } from 'lucide-react';
import { addProductToCart, formatRupiah, openWhatsAppOrder } from '../utils/shop';

const popularProductNames = [
  'Nastar Keju Special',
  'Kastengel Rombutter',
  'Lidah Kucing Rombutter',
  'Almond Cookies Rombutter',
];

const getPopularProducts = (productList) =>
  popularProductNames
    .map((name) => productList.find((product) => product.name === name))
    .filter(Boolean);

const Home = () => {
  const [products, setProducts] = useState(getPopularProducts(catalogProducts));

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        const popularProducts = getPopularProducts(res.data || []);
        if (popularProducts.length) {
          setProducts(popularProducts);
        }
      })
      .catch(() => setProducts(getPopularProducts(catalogProducts)));
  }, []);

  const handleAddToCart = (product) => {
    addProductToCart(product);
    alert('Produk ditambahkan ke keranjang!');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-amber-100 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Kue Lezat untuk Momen Spesial Anda
          </h1 >
          <p className="text-amber-800 mb-6">
            Dibuat dengan bahan-bahan premium dan cinta yang tulus. 
            Risa Resa Cookies menghadirkan rasa yang tak terlupakan.
          </p>
          <Link to="/products" className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition">
            Lihat Produk
          </Link>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img 
            src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800" 
            alt="Hero" 
            className="rounded-xl shadow-2xl"
          />
        </div>
      </section>

      {/* Popular Products */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Produk Populer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {products.map((product) => (
            <div key={product.id} className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="h-48 w-full overflow-hidden bg-amber-50">
                <img src={resolveProductImage(product.image)} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="min-h-[3.5rem] font-bold text-lg mb-2 leading-snug">{product.name}</h3>
                <p className="mt-auto text-amber-600 font-bold mb-4">{formatRupiah(product.price)}</p>
                <div className="grid grid-cols-3 gap-2">
                  <Link to={`/products/${product.id}`} className="flex items-center justify-center gap-1 border border-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition text-sm font-semibold">
                    <Eye size={16} /> Detail
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center border border-amber-200 text-amber-700 py-2 rounded-md hover:bg-amber-100 transition text-sm font-semibold"
                    title="Tambah ke keranjang"
                    aria-label={`Tambah ${product.name} ke keranjang`}
                  >
                    <ShoppingCart size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openWhatsAppOrder(product)}
                    className="flex items-center justify-center border border-green-200 text-green-700 py-2 rounded-md hover:bg-green-100 transition text-sm font-semibold"
                    title="Pesan lewat WhatsApp"
                    aria-label={`Pesan ${product.name} lewat WhatsApp`}
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
