import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET); 
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};