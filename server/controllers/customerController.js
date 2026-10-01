import {
  saveCustomerToFirebase,
  getCustomersFromFirebase,
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
