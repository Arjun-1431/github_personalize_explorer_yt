import express from "express";

import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();


import "./passport/github.auth.js";

import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import authRoutes from "./routes/auth.route.js";

import connectMongoDB from "./db/connectMongoDB.js";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();


app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
 
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get('*',(_,res)=>{
  res.sendFile (path.resolve(__dirname,"frontend" ,"dist" ,"index.html"))
});
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  connectMongoDB();
});
