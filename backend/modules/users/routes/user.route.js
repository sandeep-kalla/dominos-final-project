import express from 'express';
import { saveUser, getUser } from '../controllers/user-controller.js';

const router = express.Router();

// Route to save user
router.post('/saveUser', saveUser);

// Route to get user by uid
router.get('/getUser/:uid', getUser);

export default router;
