const checkToken = require("../auth/token-handlers").checkToken;

module.exports = roles => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      const decToken = checkToken(token);

      if (decToken && !roles) {
        req.token = decToken;
        next();
      } else if (decToken && roles.includes(decToken.role)) {
        req.token = decToken;
        next();
      } else {
        res.status(403).json({ message: "Unauthorized." });
      }
    } else {
      res.status(400).json({ message: "No token provided." });
    }
  };
};
