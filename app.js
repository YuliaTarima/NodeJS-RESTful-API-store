const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose.connect("mongodb+srv://rest-shop:rest-shop@node-rest-shop-7aywh.mongodb.net/test?retryWrites=true&w=majority",

    // "mongodb+srv://rest-shop:@node-rest-shop-7aywh.mongodb.net/test?retryWrites=true&w=majority",
    { 
        // user: process.env.MONGO_ATLAS_USER, 
        // pass: process.env.MONGO_ATLAS_PW,
        useNewUrlParser :true,
        useUnifiedTopology: true
  }
)
.then(() => console.log('MongoDB connected...'))
.catch(err => { // if error we will be here
    console.error('App starting error:', err.stack);
    process.exit(1);
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;