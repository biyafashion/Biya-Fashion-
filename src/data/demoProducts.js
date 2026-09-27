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
    description: "Everyday luxury essential crewneck and graphic t-shirts crafted from 100% combed cotton.",
    itemCount: 18,
    status: "Active"
  },
  {
    id: "cat-2",
    name: "Casual Wear",
    slug: "casual-wear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    description: "Relaxed fit silhouettes designed for supreme comfort and modern street style.",
    itemCount: 14,
    status: "Active"
  },
  {
    id: "cat-3",
    name: "Shirts",
    slug: "shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    description: "Tailored oxford cotton and linen-blend casual & semi-formal button-downs.",
    itemCount: 12,
    status: "Active"
  },
  {
    id: "cat-4",
    name: "Polo T-Shirts",
    slug: "polo-t-shirts",
    image: "https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=800&q=80",
    description: "Classic pique knit polo tees with ribbed collars and refined gold-tipped accents.",
    itemCount: 10,
    status: "Active"
  },
  {
    id: "cat-5",
    name: "Hoodies",
    slug: "hoodies",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    description: "Heavyweight French terry hoodies providing exceptional warmth and structured drape.",
    itemCount: 8,
    status: "Active"
  },
  {
    id: "cat-6",
    name: "Jeans",
    slug: "jeans",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80",
    description: "Durable stretch-denim trousers in tapered, slim, and relaxed contemporary cuts.",
    itemCount: 9,
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
    name: "Oversized Green T-Shirt",
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
    name: "Casual Cotton Shirt",
    sku: "BF-SHT-004",
    category: "Casual Wear",
    description: "Versatility at its finest. Our signature long-sleeve cotton shirt transitions seamlessly from relaxed office meetings to weekend evening dinners. Breathable poplin weave with natural mother-of-pearl finish buttons.",
    price: 1899,
    discountPrice: 1299,
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green", "Sky Blue", "White"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.6,
    reviewsCount: 73,
    featured: false,
    newArrival: false,
    bestSeller: true,
    details: {
      fabric: "100% Giza Cotton Poplin",
      weight: "160 GSM Lightweight",
      fit: "Tailored Slim Fit",
      care: "Dry clean or gentle hand wash."
    }
  },
  {
    id: "prod-5",
    name: "Premium Polo T-Shirt",
    sku: "BF-POL-005",
    category: "Polo T-Shirts",
    description: "Sporting elegance redefined. Designed with a honey-comb pique knit that facilitates cooling airflow. Detailed with a contrast gold tipped collar, custom engraved horn buttons, and the signature BIYA crest embroidery.",
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
    name: "Classic Hoodie",
    sku: "BF-HOD-006",
    category: "Hoodies",
    description: "The pinnacle of snug luxury. Heavy 380 GSM brushed fleece inside keeps you warm in breezy climates, while the double-layered structured hood retains its crisp sculptural shape. Accented with brass-gold eyelets and braided aglets.",
    price: 2499,
    discountPrice: 1799,
    stock: 22,
    sizes: ["M", "L", "XL"],
    colors: ["Deep Forest Green", "Heather Grey", "Midnight Black"],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.9,
    reviewsCount: 142,
    featured: true,
    newArrival: true,
    bestSeller: true,
    details: {
      fabric: "80% Cotton / 20% Polyester Heavyweight Fleece",
      weight: "380 GSM Thermal",
      fit: "Relaxed Fit",
      care: "Turn inside out before wash. Hang dry away from direct heat."
    }
  },
  {
    id: "prod-7",
    name: "Tailored Oxford Shirt",
    sku: "BF-SHT-007",
    category: "Shirts",
    description: "An understated wardrobe essential crafted from authentic pinpoint Oxford cotton weave. Features button-down collar points, curved hem, and refined box pleat for effortless natural movement.",
    price: 1999,
    discountPrice: 1399,
    stock: 19,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Classic Blue", "Sage Green"],
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.7,
    reviewsCount: 65,
    featured: false,
    newArrival: true,
    bestSeller: false,
    details: {
      fabric: "100% Two-Ply Oxford Cotton",
      weight: "180 GSM",
      fit: "Regular Tailored Fit",
      care: "Warm iron with light steam."
    }
  },
  {
    id: "prod-8",
    name: "Comfort Tapered Jeans",
    sku: "BF-JEA-008",
    category: "Jeans",
    description: "Engineered for flexibility and style. Handcrafted with Japanese selvedge-inspired indigo wash, reinforced copper rivets, and 2% elastane for unrestricted mobility. Perfect companion to Biya T-Shirts.",
    price: 2799,
    discountPrice: 1999,
    stock: 31,
    sizes: ["30", "32", "34", "36"],
    colors: ["Dark Indigo", "Washed Black", "Mid Blue"],
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
    ],
    rating: 4.8,
    reviewsCount: 88,
    featured: true,
    newArrival: false,
    bestSeller: true,
    details: {
      fabric: "98% Cotton / 2% Spandex Indigo Denim",
      weight: "13.5 oz Denim",
      fit: "Tapered Leg",
      care: "Wash inside out in cold water. Air dry."
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
  whatsappNumber: "919876543210",
  deliveryCharge: 99,
  freeDeliveryAbove: 999,
  supportEmail: "care@biyafashion.com",
  supportPhone: "+91 98765 43210",
  address: "Plot 42, Royal Textile Avenue, Ring Road, Surat, Gujarat - 395002, India",
  enableCashOnDelivery: true,
  enableWhatsAppOrder: true,
  maintenanceMode: false
};
