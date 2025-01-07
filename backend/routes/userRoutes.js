import express from 'express';
import {authenticate} from '../middlewares/authMiddleware.js'
import { getUserDetails, searchUsername } from '../controllers/userController.js';

const router = express.Router();

router.get('/details', authenticate, getUserDetails);

router.get('/search', authenticate, searchUsername);

export default router;