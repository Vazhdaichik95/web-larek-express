import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/products';
import { validateCreateProduct } from '../middlewares/validation/product';

const router = Router();

router.get('/', getProducts);
router.post('/', validateCreateProduct, createProduct);

export default router;
