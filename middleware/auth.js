var jwt = require('jsonwebtoken');

exports.checktoken = (req,res,next) => {
    jwt.verify(req.headers.authorization, 'instagram',next);
}