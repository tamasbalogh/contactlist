let jwt = require('jwt-simple');
let auth = require('../auth/auth');
let User = require('../../models/user');

let jwtkey = '0123456789'

module.exports = (req, res, next) => {
    let token = auth.getToken(req.headers)
    if (token) {
        try {
            let decoded = jwt.decode(token, jwtkey)
            User.findOne({
                email: decoded.email
            }, (err, user) => {
                if (err || !user) {
                    console.log(3000, 'User not found')
                    return res.status(404).send({success: false, msg: 'User not found.'})
                }
                next()
            });
        } catch (err) {
            console.log(3001, 'Unauthorized')
            return res.status(403).send({'msg': 'Unauthorized'})
        }
    } else {
        console.log(3002, 'Invalid token.')
        return res.status(401).send({'msg': 'Invalid token'})
    }
};