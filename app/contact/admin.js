const auth = require('../auth/auth')
Contact = require('../../models/contact')
User = require('../../models/user')


let getRegisteredUsers = (req, res) => {
    const token = auth.getToken(req.headers)
    if (token) {
        auth.getUser(auth.getToken(req.headers))
            .then((result) => {
                const user = result.user
                if (user.role != 'admin') {
                    console.log(7000, 'Only admin can access to this function.');
                    return res.status(403).send({msg: 'Only admin can access to this function.'});
                } else {
                    User.find({}, (err, users) => {
                        if (err) {
                            console.log(7001, 'Something went wrong.');
                            return res.status(500).send({msg: 'Something went wrong.'});
                        }
                        if (!users || users.length === 0) {
                            console.log(7002, 'There is no registered user.');
                            return res.status(200).send({msg: 'There is no registered user.'});
                        }
                        console.log(7003, 'Registered users: ' + users.length)
                        return res.status(200).send({users: users})
                    })
                }
            })
    } else {
        console.log(7004, 'No token provided');
        return res.status(403).send({msg: 'No token provided.'})
    }
};

module.exports = {
    getRegisteredUsers,

};