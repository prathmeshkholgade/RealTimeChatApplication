import "dotenv/config";
import express from "express";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import db from "./config/dataBase.js";
import cors from "cors";
import projectRouter from "./routes/projectRoutes.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors(
//     cors({
//       origin: "http://localhost:5173/",
//       methods: ["get", "post", "delete", "put", "patch"],
//       allowedHeaders: [
//         "Content-Type",
//         "Authorization",
//         "Cache-Control",
//         "Expires",
//         "pragma",
//       ],
//       credentials: true,
//     })
//   )
// );

app.use("/user", userRouter);
app.use("/project", projectRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/", (err, req, res, next) => {
  let { status = 505, message = "something went wrong" } = err;
  res.status(status).json(message);
});

export default app;
