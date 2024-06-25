const jwt = require('jsonwebtoken');
const User = require('./models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'superkeysuperkeysuperkey');
    const user = await User.findOne({ _id: decoded._id,'tokens.token': token});

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send('Please authenticate');
  }
};

module.exports = authMiddleware;