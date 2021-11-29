const jwt = require("jsonwebtoken");
const User = require('../models/user')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'thisisnewcourses');
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ Error: 'Please Authenticate' })
    }
}

module.exports = auth;