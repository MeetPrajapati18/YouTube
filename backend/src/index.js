// // when you try to connect with db then there can be problem so use it using try catch method

// // require('dotenv').config({ path: `./env` });

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js';

dotenv.config({
  path: "./.env"
});

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
  })
})
.catch((err) => {
  console.log("MONGO db connection failed !!! ", err);
})

// import dotenv from "dotenv";
// import connectDB from "./db/index.js";
// import { app } from "./app.js";
// import express from "express";

// dotenv.config({ path: "./.env" });

// async function startServer() {
//   try {
//     await connectDB();
//     const PORT = process.env.PORT || 8000;
//     app.listen(PORT, () => {
//       console.log(`⚙️ Server is running at port: ${PORT}`);
//     });
//   } catch (error) {
//     console.error("MONGO db connection failed !!!", error);
//   }
// }

// startServer();
