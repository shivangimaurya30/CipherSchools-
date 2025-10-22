import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

// Required authentication middleware
export const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return next(createError(401, "Authentication required"));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;

    next();
  } catch (error) {
    next(createError(401, "Invalid or expired token"));
  }
};

// Optional authentication middleware
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (token) {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedData;
    }

    next();
  } catch (error) {
    // For optional auth, we just clear the user and continue
    req.user = null;
    next();
  }
};