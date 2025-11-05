import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Clave-muy-muy-secreta";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: "No se ha proporcionado el encabezado de autorización" 
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No se ha proporcionado el token" 
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          success: false,
          message: "Token inválido o expirado" 
        });
      }
      
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: "Error al verificar el token",
      error: error.message 
    });
  }
};