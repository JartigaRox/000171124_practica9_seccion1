// src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "Clave-muy-muy-secreta";
const SALT_ROUNDS = 10;

// Registro de usuario
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "El nombre, el correo electrónico y la contraseña son obligatorios",
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Formato de correo electrónico inválido",
      });
    }

    // Validar longitud de password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con este correo electrónico",
      });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear usuario
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Generar token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Usuario creado con éxito",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({
      success: false,
      message: "Error creando usuario",
      error: error.message,
    });
  }
};

// Inicio de sesión
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico y la contraseña son obligatorios",
      });
    }

    // Buscar usuario
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const user = result.rows[0];

    // Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // No devolver el password
    delete user.password;

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({
      success: false,
      message: "Error durante el inicio de sesión",
      error: error.message,
    });
  }
};

// Verificar token (ruta protegida de ejemplo)
export const verifyAuth = async (req, res) => {
  try {
    // El middleware ya verificó el token y añadió req.user
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "El token es válido",
      data: {
        user: result.rows[0],
      },
    });
  } catch (error) {
    console.error("Error en la verificación de autenticación:", error);
    res.status(500).json({
      success: false,
      message: "Error verificando la autenticación",
      error: error.message,
    });
  }
};