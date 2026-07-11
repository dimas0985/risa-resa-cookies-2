import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { catalogProducts, resolveProductImage } from '../data/productCatalog';
import { Eye, MessageCircle, ShoppingCart } from 'lucide-react';
import { addProductToCart, formatRupiah, openWhatsAppOrder } from '../utils/shop';

const ProductList = () => {
  const [products, setProducts] = useState(catalogProducts);

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        if (res.data?.length) {
          setProducts(res.data);
        }
      })
      .catch(() => setProducts(catalogProducts));
  }, []);

  const handleAddToCart = (product) => {
    addProductToCart(product);
    alert('Produk ditambahkan ke keranjang!');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Risa Resa Cookies</p>
        <h2 className="text-3xl font-bold text-gray-800">Katalog Produk</h2>
        <p className="max-w-2xl text-gray-600">
          Pilihan kue kering premium dengan foto produk asli, cocok untuk hampers, suguhan keluarga, dan momen spesial.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {products.map((product) => (
          <div key={product.id} className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="h-56 w-full overflow-hidden bg-amber-50">
              <img
                src={resolveProductImage(product.image)}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="min-h-[3.5rem] font-bold text-lg text-gray-900 mb-2 leading-snug">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
              <div className="mt-auto flex justify-between items-center mb-4">
                <p className="text-amber-600 font-bold">{formatRupiah(product.price)}</p>
                <p className="text-sm text-gray-500">Stok {product.stock}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  to={`/products/${product.id}`}
                  className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
                  title="Lihat detail"
                >
                  <Eye size={16} /> Detail
                </Link>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center justify-center bg-amber-100 text-amber-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-amber-200 transition"
                  title="Tambah ke keranjang"
                  aria-label={`Tambah ${product.name} ke keranjang`}
                >
                  <ShoppingCart size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => openWhatsAppOrder(product)}
                  className="flex items-center justify-center bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-green-200 transition"
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
    </div>
  );
};

export default ProductList;
