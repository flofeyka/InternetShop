const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const mongoose = require("mongoose");
const purchaseRouter = require("./routes/purchaseRouter");
const favouriteRouter = require("./routes/favouriteRouter");
const errorMiddleware = require("./middlewares/error-middleware");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}));
app.use("/api/auth", authRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/profile", profileRouter);
app.use("/api/favourites", favouriteRouter)
app.use(errorMiddleware);

const start = () => {
    try {
        mongoose.connect("mongodb://localhost:27017/internetShop", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(port, () => console.log(`Server is started on ${port} port`));
    } catch(e) {
        console.log(e);
    }
}

start();
