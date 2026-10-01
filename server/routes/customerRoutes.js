import express from 'express';
import {
  createOrUpdateCustomer,
  getAllCustomers,
} from '../controllers/customerController.js';

const router = express.Router();

router.post('/', createOrUpdateCustomer);
router.get('/', getAllCustomers);

export default router;
