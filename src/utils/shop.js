export const WHATSAPP_NUMBER = '6287869198381';

export const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export const addProductToCart = (product, quantity = 1) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingIndex = cart.findIndex((item) => String(item.id) === String(product.id));

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
};

export const buildWhatsAppOrderUrl = ({ items, totalPrice, address = '', paymentMethod = '', customerName = '' }) => {
  const productLines = items
    .map((item, index) => {
      const subtotal = Number(item.price || 0) * Number(item.quantity || 1);
      return `${index + 1}. ${item.name} x${item.quantity || 1} - ${formatRupiah(subtotal)}`;
    })
    .join('\n');

  const message = [
    'Halo Risa Resa Cookies, saya ingin melakukan pemesanan:',
    '',
    productLines,
    '',
    `Total: ${formatRupiah(totalPrice)}`,
    customerName ? `Nama: ${customerName}` : '',
    address ? `Alamat: ${address}` : '',
    paymentMethod ? `Pembayaran: ${paymentMethod}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const openWhatsAppOrder = (product) => {
  const url = buildWhatsAppOrderUrl({
    items: [{ ...product, quantity: product.quantity || 1 }],
    totalPrice: Number(product.price || 0) * Number(product.quantity || 1),
  });

  window.open(url, '_blank', 'noopener,noreferrer');
};
