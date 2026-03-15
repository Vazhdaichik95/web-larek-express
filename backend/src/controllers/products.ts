import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/BadRequestError';
import ConflictError from '../errors/ConflictError';
import Product from '../models/product';

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.find()
    .then((items) => res.json({ items, total: items.length }))
    .catch(next);
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;

  Product.create({
    title, image, category, description, price,
  })
    .then((product) => res.status(201).json(product))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(error.message));
      }
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError('Товар с таким названием уже существует'));
      }
      return next(error);
    });
};
