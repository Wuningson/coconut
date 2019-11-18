const jwt = require('jsonwebtoken');
const config = require('config');
const private = config.get('JWT_KEY');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, private);
    req.userData = decoded;
    next();
  }catch(error){
    return res.status(401).json({
        message: 'Auth failed'
    })
  }
}