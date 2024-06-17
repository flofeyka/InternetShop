require('dotenv').config()
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const mongoose = require("mongoose");
const purchaseRouter = require("./routes/purchaseRouter");
const favouriteRouter = require("./routes/favouriteRouter");
const errorMiddleware = require("./middlewares/error-middleware");
const cartRouter = require("./routes/cartRouter");
const fileUpload = require("express-fileupload");
const orderRouter = require('./routes/orderRouter');
const app = express();
const port = 5000;
app.use(fileUpload())
app.use(express.json());
app.use(cookieParser());
app.use(express.static("static"));
app.use(cors({credentials: true, origin: true}));
app.use("/api/auth", authRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/profile", profileRouter);
app.use("/api/favourites", favouriteRouter);
app.use("/api/order", orderRouter)
app.use("/api/cart", cartRouter);
app.use(errorMiddleware);

const start = () => {
    try {
        mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(port, () => console.log(`Server is started on ${port} port`));
    } catch(e) {
        console.log(e);
    }
}

start();
