import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

//routes import

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import reviewRoutes from "./routes/review.routes.js";

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/cart',cartRoutes);
app.use('/api/v1/rating',ratingRoutes);
app.use('/api/v1/review',reviewRoutes);

export {app};