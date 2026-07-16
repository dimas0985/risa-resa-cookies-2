const API_URL = import.meta.env.VITE_API_URL || "https://risa-resa-cookies-2-backend-production.up.railway.app";
const productImages = {
  almondCookiesRombutter: 'Almond-Cookies-Rombutter.jpg',
  chocoChipRombutter: 'Choco-Chip-Rombutter.jpg',
  coklatMedeRombutter: 'Coklat-Mede-Rombutter.jpg',
  jagungRombutter: 'Jagung-Rombutter.jpg',
  kastengelRombutter: 'Kastengel-Rombutter.jpg',
  kastengelSpecial: 'Kastengel-Special.jpg',
  lidahKucingRombutter: 'Lidah-Kucing-Rombutter.jpg',
  nastarDaunSpecial: 'Nastar-Daun-Special.jpg',
  nastarKejuRombutter: 'Nastar-Keju-Rombutter.jpg',
  nastarKejuSpecial: 'Nastar-Keju-Special.jpg',
  nastarKeju: 'Nastar-Keju.jpg',
  putriSaljuRombutter: 'Putri-Salju-Rombutter.jpg',
  saguKejuRombutter: 'Sagu-Keju-Rombutter.jpg',
  sempritCoklat: 'Semprit-Coklat.jpg',
  semprotNanas: 'Semprot-Nanas.jpg',
};

const imageUrl = (filename) => `/products/${filename}`;

export const catalogProducts = [
  {
    id: 'catalog-nastar-keju',
    name: 'Nastar Keju',
    description: 'Nastar klasik dengan isian nanas manis dan taburan keju gurih.',
    price: 85000,
    stock: 25,
    image: imageUrl(productImages.nastarKeju),
  },
  {
    id: 'catalog-nastar-keju-special',
    name: 'Nastar Keju Special',
    description: 'Nastar premium dengan rasa keju yang lebih kaya untuk hampers dan sajian lebaran.',
    price: 95000,
    stock: 20,
    image: imageUrl(productImages.nastarKejuSpecial),
  },
  {
    id: 'catalog-nastar-keju-rombutter',
    name: 'Nastar Keju Rombutter',
    description: 'Nastar lembut dengan aroma butter yang harum dan tekstur lumer.',
    price: 105000,
    stock: 18,
    image: imageUrl(productImages.nastarKejuRombutter),
  },
  {
    id: 'catalog-nastar-daun-special',
    name: 'Nastar Daun Special',
    description: 'Nastar bentuk daun yang cantik dengan rasa nanas legit dan adonan premium.',
    price: 95000,
    stock: 16,
    image: imageUrl(productImages.nastarDaunSpecial),
  },
  {
    id: 'catalog-kastengel-special',
    name: 'Kastengel Special',
    description: 'Kue keju renyah dengan rasa gurih yang cocok untuk suguhan keluarga.',
    price: 98000,
    stock: 22,
    image: imageUrl(productImages.kastengelSpecial),
  },
  {
    id: 'catalog-kastengel-rombutter',
    name: 'Kastengel Rombutter',
    description: 'Kastengel dengan butter premium, renyah, wangi, dan gurih.',
    price: 108000,
    stock: 18,
    image: imageUrl(productImages.kastengelRombutter),
  },
  {
    id: 'catalog-putri-salju-rombutter',
    name: 'Putri Salju Rombutter',
    description: 'Putri salju lembut bertabur gula halus dengan aroma butter yang khas.',
    price: 90000,
    stock: 24,
    image: imageUrl(productImages.putriSaljuRombutter),
  },
  {
    id: 'catalog-sagu-keju-rombutter',
    name: 'Sagu Keju Rombutter',
    description: 'Sagu keju ringan, lumer, dan harum untuk teman minum teh.',
    price: 88000,
    stock: 21,
    image: imageUrl(productImages.saguKejuRombutter),
  },
  {
    id: 'catalog-lidah-kucing-rombutter',
    name: 'Lidah Kucing Rombutter',
    description: 'Lidah kucing tipis dan renyah dengan cita rasa butter premium.',
    price: 82000,
    stock: 20,
    image: imageUrl(productImages.lidahKucingRombutter),
  },
  {
    id: 'catalog-semprit-coklat',
    name: 'Semprit Coklat',
    description: 'Semprit coklat renyah dengan rasa manis yang pas.',
    price: 78000,
    stock: 26,
    image: imageUrl(productImages.sempritCoklat),
  },
  {
    id: 'catalog-semprot-nanas',
    name: 'Semprot Nanas',
    description: 'Kue semprot dengan sentuhan nanas yang segar dan manis.',
    price: 78000,
    stock: 19,
    image: imageUrl(productImages.semprotNanas),
  },
  {
    id: 'catalog-choco-chip-rombutter',
    name: 'Choco Chip Rombutter',
    description: 'Cookies renyah dengan choco chip melimpah dan aroma butter.',
    price: 88000,
    stock: 23,
    image: imageUrl(productImages.chocoChipRombutter),
  },
  {
    id: 'catalog-coklat-mede-rombutter',
    name: 'Coklat Mede Rombutter',
    description: 'Cookies coklat dengan kacang mede gurih dan tekstur renyah.',
    price: 95000,
    stock: 17,
    image: imageUrl(productImages.coklatMedeRombutter),
  },
  {
    id: 'catalog-almond-cookies-rombutter',
    name: 'Almond Cookies Rombutter',
    description: 'Cookies almond dengan butter premium, renyah, dan wangi.',
    price: 98000,
    stock: 18,
    image: imageUrl(productImages.almondCookiesRombutter),
  },
  {
    id: 'catalog-jagung-rombutter',
    name: 'Jagung Rombutter',
    description: 'Cookies jagung unik dengan rasa manis gurih dan aroma butter.',
    price: 82000,
    stock: 20,
    image: imageUrl(productImages.jagungRombutter),
  },
];

export const resolveProductImage = (image) => {
  if (!image) {
    return 'https://via.placeholder.com/600?text=Risa+Resa+Cookies';
  }

  if (image.startsWith('http')) {
    return image;
  }

  if (image.startsWith('/products/')) {
    return image;
  }

  return `${API_URL}/${image.replace(/^\/+/, '')}`;
};

export const findCatalogProduct = (id) =>
  catalogProducts.find((product) => String(product.id) === String(id));
