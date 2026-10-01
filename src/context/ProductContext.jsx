import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as storageService from '../services/storageService';
import {
  fetchProductsFromBackend,
  createProductOnBackend,
  updateProductOnBackend,
  deleteProductOnBackend,
} from '../services/apiService';
import { useToast } from './ToastContext';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load products from storage service and sync with Backend / Firebase Firestore
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Instant load from local storage
      const localProds = storageService.getProducts();
      const cats = storageService.getCategories();
      setProducts(localProds);
      setCategories(cats);

      // 2. Fetch fresh catalog from Backend & Firebase (Remote is source of truth)
      const remoteProds = await fetchProductsFromBackend();
      if (remoteProds && Array.isArray(remoteProds)) {
        setProducts(remoteProds);
        storageService.setProductsCache(remoteProds);
      }
    } catch (err) {
      console.warn('Backend products sync skipped, using local store:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Product CRUD
  const handleAddProduct = useCallback(async (productData) => {
    const created = storageService.addProduct(productData);
    setProducts((prev) => [created, ...prev.filter((p) => String(p.id) !== String(created.id))]);
    // Save to Firebase backend
    try {
      await createProductOnBackend(created);
    } catch (err) {
      console.warn('Backend product create skipped:', err.message);
    }
    toast.success(`"${created.name}" added successfully.`);
    return created;
  }, [toast]);

  const handleUpdateProduct = useCallback(async (id, updatedFields) => {
    const updated = storageService.updateProduct(id, updatedFields);
    if (updated) {
      setProducts((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
      try {
        await updateProductOnBackend(id, updatedFields);
      } catch (err) {
        console.warn('Backend product update skipped:', err.message);
      }
      toast.success(`"${updated.name}" updated successfully.`);
    }
    return updated;
  }, [toast]);

  const handleDeleteProduct = useCallback(async (id) => {
    const prod = products.find((p) => String(p.id) === String(id));
    // 1. Immediately remove from local memory state
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    // 2. Remove permanently from browser storage cache
    storageService.deleteProduct(id);
    // 3. Permanent hard delete from Firebase Firestore & backend JSON
    try {
      await deleteProductOnBackend(id);
    } catch (err) {
      console.warn('Backend product delete skipped:', err.message);
    }
    toast.success(`"${prod?.name || 'Product'}" permanently deleted.`);
    return true;
  }, [products, toast]);

  const handleDuplicateProduct = useCallback((id) => {
    const target = products.find((p) => String(p.id) === String(id));
    if (!target) return null;

    const duplicatedData = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      sku: `${target.sku}-COPY`,
      createdAt: new Date().toISOString()
    };

    const created = storageService.addProduct(duplicatedData);
    setProducts((prev) => [created, ...prev]);
    toast.success(`Duplicated "${target.name}".`);
    return created;
  }, [products, toast]);

  // Category CRUD
  const handleAddCategory = useCallback((categoryData) => {
    const created = storageService.addCategory(categoryData);
    setCategories((prev) => [...prev, created]);
    toast.success(`Category "${created.name}" added successfully.`);
    return created;
  }, [toast]);

  const handleUpdateCategory = useCallback((id, updatedFields) => {
    const updated = storageService.updateCategory(id, updatedFields);
    if (updated) {
      setCategories((prev) => prev.map((c) => (String(c.id) === String(id) ? updated : c)));
      toast.success(`Category "${updated.name}" updated successfully.`);
    }
    return updated;
  }, [toast]);

  const handleDeleteCategory = useCallback((id) => {
    const cat = categories.find((c) => String(c.id) === String(id));
    const success = storageService.deleteCategory(id);
    if (success) {
      setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)));
      toast.success(`Category "${cat?.name || 'Category'}" deleted successfully.`);
    }
    return success;
  }, [categories, toast]);

  // Filtered views
  const featuredProducts = useMemo(() => products.filter((p) => p.featured), [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.newArrival), [products]);
  const bestSellers = useMemo(() => products.filter((p) => p.bestSeller), [products]);

  const handleClearAllProducts = useCallback(async () => {
    const toDelete = [...products];
    storageService.clearAllProducts();
    setProducts([]);
    for (const p of toDelete) {
      try {
        await deleteProductOnBackend(p.id);
      } catch (err) {
        // ignore
      }
    }
    toast.success('All products cleared from catalog.');
  }, [products, toast]);

  const value = {
    products,
    categories,
    loading,
    refreshProducts: loadData,
    addProduct: handleAddProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    duplicateProduct: handleDuplicateProduct,
    clearAllProducts: handleClearAllProducts,
    addCategory: handleAddCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    featuredProducts,
    newArrivals,
    bestSellers
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;
