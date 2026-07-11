const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }
};

exports.isAdmin = (req, res, next) => {

  try {
	 console.log(req.user)

    if (req.user.role !== "admin") {

      return res.status(403).json({
        message: "Admin only",
      });

    }

    next();

  } catch (err) {

    return res.status(403).json({
      message: "Unauthorized",
    });

  }
};