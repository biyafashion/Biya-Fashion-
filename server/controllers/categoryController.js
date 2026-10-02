import {
  saveCategoryToFirebase,
  getCategoriesFromFirebase,
  updateCategoryInFirebase,
  deleteCategoryFromFirebase,
} from '../services/firebaseService.js';

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    if (!categoryData || !categoryData.name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const saved = await saveCategoryToFirebase(categoryData);
    res.status(201).json({ success: true, category: saved });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category: ' + error.message });
  }
};

// GET /api/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await getCategoriesFromFirebase();
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateCategoryInFirebase(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ success: true, category: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category.' });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCategoryFromFirebase(id);
    res.json({ success: true, message: `Category ${id} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};
