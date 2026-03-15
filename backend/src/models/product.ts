import mongoose from 'mongoose';

export interface IProduct {
  title: string,
  image: {
    fileName: string,
    originalName: string
  },
  category: string,
  description: string,
  price?: number | null,
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина "title" — 2'],
    maxlength: [30, 'Максимальная длина "title" — 30'],
  },
  image: {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  category: { type: String, required: [true, 'Поле "category" обязательное'] },
  description: { type: String },
  price: { type: Number, default: null },
});

export default mongoose.model<IProduct>('product', productSchema);
