import express from 'express';
import cookieParser from 'cookie-parser';
import ordersRouter from "./routes/order.routes.js";
import productsRouter from "./routes/product.routes.js";
import usersRouter from "./routes/user.routes.js";
import cors from "cors";
import { configDotenv } from 'dotenv';
configDotenv();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/users", usersRouter);

export { app }