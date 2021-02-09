import express from 'express';
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } from '../contorllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/myorders').get(protect, getMyOrders);
router.post('/', protect, addOrderItems);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);


export default router;
