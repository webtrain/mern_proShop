import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc    Create new Order
// @route   Post/api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get  Order by Id
// @route   Get/api/orders/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update Order to paid
// @route   Get/api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  const {
    id,
    status,
    update_time,
    payer: {
      name: { given_name, surname },
      email_address,
    },
  } = req.body;

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    order.paymentResult = {
      id: id,
      status: status,
      name: given_name + ' ' + surname,
      email_address: email_address,
      update_time: update_time,
    };


    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { addOrderItems, getOrderById, updateOrderToPaid };
