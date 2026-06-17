import jwt from 'jsonwebtoken';
import Usuario from '../models/User.js';

export const autenticar = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Token no proporcionado',
        error: 'AUTH_TOKEN_MISSING'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Usuario no encontrado',
        error: 'AUTH_USER_NOT_FOUND'
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({ 
        mensaje: 'Usuario desactivado',
        error: 'AUTH_USER_INACTIVE'
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        mensaje: 'Token inválido',
        error: 'AUTH_INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        mensaje: 'Token expirado',
        error: 'AUTH_TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({ 
      mensaje: 'Error de autenticación',
      error: error.message
    });
  }
};

export const autorizar = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        mensaje: 'Usuario no autenticado',
        error: 'AUTH_UNAUTHENTICATED'
      });
    }
    
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        mensaje: 'No tienes permisos para esta acción',
        error: 'AUTH_FORBIDDEN',
        rol_requerido: roles,
        rol_actual: req.usuario.rol
      });
    }
    next();
  };
};