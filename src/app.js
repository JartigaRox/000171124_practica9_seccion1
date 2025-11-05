import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();


app.use(bodyParser.json());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "El servidor está en funcionamiento" });
});


app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;