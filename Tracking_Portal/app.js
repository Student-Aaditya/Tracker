require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const connectdB = require("./utils/mongoose.js");
const passport = require("./config/passportGoogle.js");
const authRoute = require("./Routes/authRoute.js");
const useAdmin = require("./Routes/adminRoute.js");
const developerRoutes = require("./Routes/developerRoutes.js");
const reporterRoutes = require("./Routes/reporterRoute.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tracker-7s62.onrender.com"
    ],
    credentials: true
  })
);app.use(passport.initialize());
connectdB();
app.get("/",(req,res)=>{
    res.send("hello world");
})
app.use("/api/auth",authRoute);
app.use("/api/admin",useAdmin);
app.use("/api/developer", developerRoutes);
app.use("/api/reporter", reporterRoutes);

app.listen(port,()=>{
    console.log(`Server working on ${port}`);
})
