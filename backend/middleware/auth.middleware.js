const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Obtenemos el token del encabezado
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verificamos el token
    
    // Asignamos el userId y el userRole al objeto req
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    // Log para verificar si el userId está correctamente asignado
    console.log("userId desde el token:", req.userId);  // Aquí verificamos el userId

    next();  // Llamamos al siguiente middleware o ruta
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Requires admin privileges' });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin
};
