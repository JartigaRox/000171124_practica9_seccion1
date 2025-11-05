import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
//se activa cuando ya te hayan dado un tokn en todo caso no funcionara
//import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas de usuarios requieren autenticación
//funciona con el token
//router.use(verifyToken);

// Rutas CRUD de usuarios
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;