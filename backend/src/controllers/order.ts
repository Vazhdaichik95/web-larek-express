import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import BadRequestError from '../errors/BadRequestError';

// eslint-disable-next-line import/prefer-default-export
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      items, total,
    } = req.body;

    // 1. Найти все товары по переданным id
    const products = await Product.find({ _id: { $in: items } });

    // 2. Проверить, что все id существуют
    if (products.length !== items.length) {
      return next(new BadRequestError('Один или несколько товаров не найдены'));
    }

    // 3. Проверить, что все товары продаются (price !== null)
    const hasUnpricedItem = products.some((p) => p.price === null || p.price === undefined);
    if (hasUnpricedItem) {
      return next(new BadRequestError('Один из товаров не продаётся (price = null)'));
    }

    // 4. Проверить, что сумма совпадает
    const calculatedTotal = products.reduce((sum, p) => sum + (p.price as number), 0);
    if (calculatedTotal !== total) {
      return next(new BadRequestError(`Сумма заказа не совпадает. Ожидается: ${calculatedTotal}`));
    }

    return res.json({ id: faker.string.uuid(), total });
  } catch (error) {
    return next(error);
  }
};
