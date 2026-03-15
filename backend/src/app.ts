import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import router from './routes';
import errorHandler from './middlewares/error-handler';

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

// Все роуты
app.use(router);

app.use(errors());

// Логгер ошибок — ПОСЛЕ роутов, ДО обработчика ошибок
app.use(errorLogger);

// Централизованный обработчик ошибок
app.use(errorHandler);

mongoose.connect(DB_ADDRESS as string)
  .then(() => {
    console.log('MongoDB подключён');
    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  })
  .catch((err) => console.error('Ошибка подключения к БД', err));
