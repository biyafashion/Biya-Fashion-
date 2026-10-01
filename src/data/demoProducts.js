/**
 * BIYA FASHION - Product and Category Data Model
 * Brand: BIYA FASHION | Tagline: WEAR YOUR STYLE
 * 
 * Clean slate configuration: All demo products and demo orders removed.
 * Ready for merchant to add official inventory.
 */

export const DEMO_CATEGORIES = [
  {
    id: "cat-1",
    name: "T-Shirts",
    slug: "t-shirts",
    image: "",
    description: "Everyday luxury essential crewneck, oversized, and graphic t-shirts crafted from 100% combed cotton.",
    itemCount: 0,
    status: "Active"
  },
  {
    id: "cat-2",
    name: "Polo T-Shirts",
    slug: "polo-t-shirts",
    image: "",
    description: "Classic honeycomb pique knit polo t-shirts with ribbed collars and refined gold-tipped accents.",
    itemCount: 0,
    status: "Active"
  }
];

export const DEMO_PRODUCTS = [];

export const DEMO_ORDERS = [];

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
