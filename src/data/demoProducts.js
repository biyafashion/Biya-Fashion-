/**
 * BIYA FASHION - Demo Products and Categories Data
 * Brand: BIYA FASHION | Tagline: WEAR YOUR STYLE
 */

export const DEMO_CATEGORIES = [
  {
    id: "cat-1",
    name: "T-Shirts",
    slug: "t-shirts",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    description: "Everyday luxury essential crewneck, oversized, and graphic t-shirts crafted from 100% combed cotton.",
    itemCount: 16,
    status: "Active"
  },
  {
    id: "cat-2",
    name: "Polo T-Shirts",
    slug: "polo-t-shirts",
    image: "https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=800&q=80",
    description: "Classic honeycomb pique knit polo t-shirts with ribbed collars and refined gold-tipped accents.",
    itemCount: 12,
    status: "Active"
  }
];

export const DEMO_PRODUCTS = [
  {
    id: "prod-1",
    name: "Classic Black T-Shirt",
    sku: "BF-TSH-001",
    category: "T-Shirts",
    description: "The foundational piece of every modern wardrobe. Cut from 220 GSM super-combed organic cotton, this Classic Black T-Shirt provides a silky-soft handfeel, breathable all-day comfort, and a tailored regular fit that keeps its shape wash after wash.",
    price: 999,
    discountPrice: 699,
    stock: 45,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Dark Green"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.8,
    reviewsCount: 124,
    featured: true,
    newArrival: false,
    bestSeller: true,
    details: {
      fabric: "100% Bio-Washed Combed Cotton",
      weight: "220 GSM Heavyweight",
      fit: "Regular European Fit",
      care: "Machine wash cold with like colors. Do not bleach. Iron on reverse."
    }
  },
  {
    id: "prod-2",
    name: "Premium White T-Shirt",
    sku: "BF-TSH-002",
    category: "T-Shirts",
    description: "A pristine optical white tee tailored for perfection. Crafted with double-needle hems and a reinforced ribbed crewneck collar that never sags. Engineered with pre-shrunk fabric to guarantee an enduring crisp look.",
    price: 1099,
    discountPrice: 749,
    stock: 52,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Off-White", "Cream"],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.9,
    reviewsCount: 98,
    featured: true,
    newArrival: true,
    bestSeller: true,
    details: {
      fabric: "100% Ring-Spun Cotton",
      weight: "210 GSM",
      fit: "Comfort Modern Fit",
      care: "Warm machine wash. Tumble dry low."
    }
  },
  {
    id: "prod-3",
    name: "Oversized Emerald Green T-Shirt",
    sku: "BF-TSH-003",
    category: "T-Shirts",
    description: "Embody the signature BIYA aesthetic in our deep forest green oversized silhouette. Featuring dropped shoulders, an elongated sleeve cut, and the iconic subtle gold emblem accent. Ultimate streetwear luxury meets casual sophistication.",
    price: 1299,
    discountPrice: 899,
    stock: 28,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Dark Green", "Olive", "Sage"],
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.7,
    reviewsCount: 86,
    featured: true,
    newArrival: true,
    bestSeller: false,
    details: {
      fabric: "240 GSM Luxury Heavyweight Cotton",
      weight: "Heavyweight drop-shoulder",
      fit: "Oversized Streetwear Fit",
      care: "Gentle cycle cold. Do not tumble dry."
    }
  },
  {
    id: "prod-4",
    name: "Luxury Graphic Street T-Shirt",
    sku: "BF-TSH-004",
    category: "T-Shirts",
    description: "Statement streetwear with artistic restraint. Featuring high-density tonal typography and royal gold crest screen-printing on premium charcoal washed cotton.",
    price: 1399,
    discountPrice: 949,
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal", "Washed Black", "Heather Grey"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.8,
    reviewsCount: 75,
    featured: true,
    newArrival: true,
    bestSeller: true,
    details: {
      fabric: "100% Combed Cotton High-Density Jersey",
      weight: "220 GSM",
      fit: "Relaxed Boxy Fit",
      care: "Machine wash cold inside out. Iron on reverse."
    }
  },
  {
    id: "prod-5",
    name: "Signature Royal Polo T-Shirt",
    sku: "BF-POL-001",
    category: "Polo T-Shirts",
    description: "Sporting elegance redefined. Designed with a honey-comb pique knit that facilitates cooling airflow. Detailed with a contrast gold tipped collar, custom engraved buttons, and signature BIYA crest embroidery.",
    price: 1599,
    discountPrice: 1099,
    stock: 40,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Emerald Green", "Navy Blue", "Pure White"],
    images: [
      "https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.9,
    reviewsCount: 110,
    featured: true,
    newArrival: false,
    bestSeller: true,
    details: {
      fabric: "Pique Cotton Blend with 5% Elastane",
      weight: "230 GSM",
      fit: "Athletic Smart Fit",
      care: "Cold machine wash with collar turned up."
    }
  },
  {
    id: "prod-6",
    name: "Classic Navy Pique Polo T-Shirt",
    sku: "BF-POL-002",
    category: "Polo T-Shirts",
    description: "A commanding deep navy hue finished with subtle pearlized buttons and ribbed sleeve bands for a flattering, athletic taper on the biceps.",
    price: 1699,
    discountPrice: 1199,
    stock: 32,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Navy Blue", "Midnight Black", "Steel Grey"],
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.9,
    reviewsCount: 88,
    featured: true,
    newArrival: true,
    bestSeller: true,
    details: {
      fabric: "100% Combed Pique Cotton",
      weight: "240 GSM",
      fit: "Tailored Smart Casual",
      care: "Machine wash cold. Lay flat to dry."
    }
  },
  {
    id: "prod-7",
    name: "White Gold-Tipped Polo T-Shirt",
    sku: "BF-POL-003",
    category: "Polo T-Shirts",
    description: "An impeccably clean white polo with regal gold tipping along the collar and cuffs. High breathability and luxurious soft drape for upscale resort and weekend wear.",
    price: 1799,
    discountPrice: 1249,
    stock: 25,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pure White", "Ivory Cream"],
    images: [
      "https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.8,
    reviewsCount: 64,
    featured: true,
    newArrival: true,
    bestSeller: false,
    details: {
      fabric: "Mercerized Combed Cotton",
      weight: "220 GSM",
      fit: "Regular Slim Fit",
      care: "Gentle wash cold. Warm iron."
    }
  },
  {
    id: "prod-8",
    name: "Forest Green Textured Polo T-Shirt",
    sku: "BF-POL-004",
    category: "Polo T-Shirts",
    description: "Engineered in our brand's iconic forest green shade. Features waffle-knit jacquard texture, breathable aerated weave, and premium metal-finish buttons.",
    price: 1799,
    discountPrice: 1299,
    stock: 29,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Forest Green", "Olive", "Dark Sage"],
    images: [
      "https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.9,
    reviewsCount: 92,
    featured: true,
    newArrival: false,
    bestSeller: true,
    details: {
      fabric: "Waffle Texture Pique Cotton",
      weight: "240 GSM Heavyweight",
      fit: "Modern Regular Fit",
      care: "Cold wash with mild detergent."
    }
  }
];

export const DEMO_ORDERS = [
  {
    id: "BFA-2026-0001",
    customer: {
      name: "Rahul Verma",
      phone: "+91 98234 56789",
      email: "rahul.verma@example.com",
      address: "Flat 402, Green Meadows Apartment, Park Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    items: [
      {
        id: "prod-1",
        name: "Classic Black T-Shirt",
        price: 699,
        quantity: 2,
        selectedSize: "L",
        selectedColor: "Black",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "prod-5",
        name: "Premium Polo T-Shirt",
        price: 1099,
        quantity: 1,
        selectedSize: "XL",
        selectedColor: "Emerald Green",
        image: "https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 2497,
    deliveryFee: 0,
    total: 2497,
    paymentMethod: "Cash on Delivery",
    status: "Delivered",
    createdAt: "2026-09-20T10:30:00Z"
  },
  {
    id: "BFA-2026-0002",
    customer: {
      name: "Pooja Sharma",
      phone: "+91 97123 45678",
      email: "pooja.sharma@example.com",
      address: "15, Lotus Enclave, Satellite Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015"
    },
    items: [
      {
        id: "prod-6",
        name: "Classic Hoodie",
        price: 1799,
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Deep Forest Green",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 1799,
    deliveryFee: 0,
    total: 1799,
    paymentMethod: "WhatsApp Order",
    status: "Shipped",
    createdAt: "2026-09-25T14:15:00Z"
  },
  {
    id: "BFA-2026-0003",
    customer: {
      name: "Amit Patel",
      phone: "+91 99887 76655",
      email: "amit.patel@example.com",
      address: "House 28, Sector 14",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001"
    },
    items: [
      {
        id: "prod-2",
        name: "Premium White T-Shirt",
        price: 749,
        quantity: 1,
        selectedSize: "M",
        selectedColor: "White",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 749,
    deliveryFee: 99,
    total: 848,
    paymentMethod: "Cash on Delivery",
    status: "Confirmed",
    createdAt: "2026-09-26T18:40:00Z"
  }
];

export const DEMO_SETTINGS = {
  storeName: "BIYA FASHION",
  tagline: "WEAR YOUR STYLE",
  currency: "₹",
  currencyCode: "INR",
  whatsappNumber: "919655625186",
  deliveryCharge: 99,
  freeDeliveryAbove: 999,
  supportEmail: "biyasfashion02@gmail.com",
  supportPhone: "+91 96556 25186",
  address: "Pandiyan Nagar, Karaiyapatti, Virudhunagar - 626106, India",
  enableCashOnDelivery: true,
  enableWhatsAppOrder: true,
  maintenanceMode: false
};
