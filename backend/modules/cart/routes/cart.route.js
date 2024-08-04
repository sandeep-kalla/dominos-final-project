import express from 'express';
import { getCart, saveCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/carts/:uid', getCart);
router.post('/carts/:uid', saveCart);

export default router;