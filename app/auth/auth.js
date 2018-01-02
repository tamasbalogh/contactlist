User = require('../../models/user')
let jwt = require('jwt-simple')

const jwtkey = '0123456789'

let register = (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.password2 || !req.body.firstname || !req.body.lastname) {
        console.log(1000, 'Please pass correct parameters.')
        return res.status(400).send({success: false, msg: 'Please pass correct parameters.'})
    }

    if (!validateEmail(req.body.email)) {
        console.log(1001, 'Invalid email address: ' + req.body.email)
        return res.status(400).send({success: false, msg: 'Invalid email address.'})
    }

    if (req.body.password !== req.body.password2) {
        console.log(1002, 'Passwords do not match')
        return res.status(400).send({success: false, msg: 'Passwords do not match.'})
    }

    User.findOne({email: req.body.email}, (err, obj) => {
        if (err) {
            console.log(1003, err.message);
            return res.status(400).send({success: false, msg: err.message});
        }
        if (obj) {
            console.log(1004, req.body.email + ' already exists!');
            return res.status(400).send({success: false, msg: 'Email already exists!'});
        } else {
            let newUser = new User({
                email: req.body.email,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            });
            newUser.save((err1) => {
                if (err1) {
                    console.log(1005, err1.message);
                    return res.status(400).send({success: false, msg: err1.message});
                } else {
                    console.log(1006, newUser.email + ' created successfully');
                    return res.status(200).send({success: true, msg: 'User created successfully.'});
                }

            });
        }
    });
}

let login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        console.log(1007, 'Please pass correct parameters.')
        return res.status(400).send({success: false, msg: 'Please pass correct parameters.'})
    }

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            console.log(1008, err.message);
            return res.status(404).send({success: false, msg: err.message})
        }
        if (!user) {
            console.log(1009, 'Authentication failed. ' + req.body.email + ' not found.')
            return res.status(404).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    let token = jwt.encode(user, jwtkey);
                    console.log(1010, 'Login successful ' + req.body.email + ', JWT provided.' + ", role " + user.role)
                    return res.status(200).send({token: 'JWT ' + token, id: user.id, role: user.role})
                } else {
                    console.log(1011, 'Wrong password')
                    return res.status(404).send({msg: 'Authentication failed. Wrong password.'})
                }
            });
        }
    });
}

let getUser = (token) => {
    return new Promise((resolve, reject) => {
        if (token) {
            let decoded = jwt.decode(token, jwtkey);
            User.findOne({
                email: decoded.email
            }, (err, user) => {
                if (err) {
                    return reject(1012, err.message);
                }
                if (!user) {
                    return reject(1013, 'User not found.');
                }
                return resolve({
                    user: user
                });

            });
        }
        else {
            return reject(1014, 'Authentication failed.');
        }
    });
}

let getToken = (headers) => {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};


let validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

module.exports = {
    register,
    login,
    getUser,
    getToken
};