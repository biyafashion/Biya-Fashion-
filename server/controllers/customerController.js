import {
  saveCustomerToFirebase,
  getCustomersFromFirebase,
  updateCustomerInFirebase,
  deleteCustomerFromFirebase,
} from '../services/firebaseService.js';

// POST /api/customers
export const createOrUpdateCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    if (!customerData || !customerData.name || !customerData.phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' });
    }

    const saved = await saveCustomerToFirebase(customerData);
    res.status(201).json({ success: true, customer: saved });
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ error: 'Failed to save customer: ' + error.message });
  }
};

// GET /api/customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await getCustomersFromFirebase();
    res.json({ success: true, customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateCustomerInFirebase(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    res.json({ success: true, customer: updated });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer.' });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCustomerFromFirebase(id);
    res.json({ success: true, message: `Customer ${id} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer.' });
  }
};
