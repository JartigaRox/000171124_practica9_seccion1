// app.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import registerEndpoints from "./endpoints.js";  

const app = express();

const PORT = 5000;
const JWT_SECRET = "your_jwt_secret"; // Usa una clave segura en producción

app.use(bodyParser.json());
app.use(cors());

// Dummy users (solo para pruebas)
const users = [];

// Middleware: Verificar token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

registerEndpoints(app);

// Rutas
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  //const user = users.find((u) => u.email === email);
  const user = true;
  if (!user) return res.status(404).json({ message: "User not found" });

  //const isPasswordValid = await bcrypt.compare(password, user.password);
  const isPasswordValid= true;
  if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });
});

app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected data accessed", user: req.user });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));