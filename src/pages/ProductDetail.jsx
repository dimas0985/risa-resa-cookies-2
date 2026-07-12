import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { findCatalogProduct, resolveProductImage } from '../data/productCatalog';
import { addProductToCart, formatRupiah } from '../utils/shop';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const catalogProduct = findCatalogProduct(id);

    if (catalogProduct) {
      setProduct(catalogProduct);
      return;
    }

    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const addToCart = () => {
    addProductToCart(product, quantity);
    alert('Produk ditambahkan ke keranjang!');
    navigate('/cart');
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-amber-600 mb-8 transition">
        <ArrowLeft size={20} className="mr-2" /> Kembali
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
        <div>
          <img src={resolveProductImage(product.image)} alt={product.name} className="w-full h-96 object-cover rounded-xl shadow-inner" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-amber-600 mb-6">{formatRupiah(product.price)}</p>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">{product.description}</p>
          
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 text-xl font-bold">-</button>
              <span className="px-6 py-2 font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 text-xl font-bold">+</button>
            </div>
            <p className="text-gray-500">Stok: {product.stock}</p>
          </div>

          <button 
            onClick={addToCart}
            className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-amber-700 transition"
          >
            <ShoppingCart size={24} /> Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
