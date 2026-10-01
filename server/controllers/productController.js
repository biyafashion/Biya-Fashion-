import {
  saveProductToFirebase,
  getProductsFromFirebase,
  getProductByIdFromFirebase,
  updateProductInFirebase,
  deleteProductFromFirebase,
} from '../services/firebaseService.js';

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    if (!productData || !productData.name || !productData.price) {
      return res.status(400).json({ error: 'Product name and price are required.' });
    }

    const saved = await saveProductToFirebase(productData);
    res.status(201).json({ success: true, product: saved });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product: ' + error.message });
  }
};

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await getProductsFromFirebase();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdFromFirebase(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateProductInFirebase(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProductFromFirebase(id);
    res.json({ success: true, message: `Product ${id} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};
