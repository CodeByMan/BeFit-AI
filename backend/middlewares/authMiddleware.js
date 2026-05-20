const jwt = require('jsonwebtoken');

exports.protect = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(Number(decoded.roleId))) 
        return res.status(403).json({ message: "Forbidden" });

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Token invalid" });
    }
  };
};
