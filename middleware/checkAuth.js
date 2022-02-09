const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) =>{
    const token = req.cookies.access_token;
    if (!token) {
      return res.sendStatus(403).json({ message: "Please Login 😏 🍀" });
    }
    try {
      const data = jwt.verify(token, "fn32iusht3209hg32263nvh92");
      req.username = data.username;
      return next();
    } catch {
      return res.sendStatus(403);
    }
  }
  