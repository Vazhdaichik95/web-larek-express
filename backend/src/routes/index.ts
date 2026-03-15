import { Router } from 'express';
import productRouter from './product';
import orderRouter from './order';

const router = Router();

router.use('/product', productRouter);
router.use('/order', orderRouter);

// 404 для всех остальных маршрутов
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

export default router;
