import express from "express";
import { signup, signin, verifyAuth } from "../controllers/authController.js";
//se activa cuando ya te hayan dado un tokn en todo caso no funcionara
//import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.post("/signup", signup);
router.post("/signin", signin);

// Rutas protegidas
//al igual aca
//router.get("/verify", verifyToken, verifyAuth);

export default router;