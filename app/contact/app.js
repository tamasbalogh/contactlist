const auth = require('../auth/auth')
Contact = require('../../models/contact')

let getContacts = (req, res) => {
    const token = auth.getToken(req.headers)
    if (token) {
        auth.getUser(auth.getToken(req.headers))
            .then((result) => {
                const user = result.user
                Contact.find({
                    userid: user.id
                }, (err, contacts) => {
                    if (err) {
                        console.log(5000, 'Something went wrong.');
                        return res.status(500).send({msg: 'Something went wrong.'});
                    }
                    if (!contacts || contacts.length === 0) {
                        console.log(5001, user.email + ' does not have any contacts');
                        return res.status(204).send({msg: 'You do not have any contacts'});
                    }
                    console.log(5002, user.email + ' have  ' + contacts.length + ' contact(s)')
                    return res.status(200).send({contacts: contacts})
                })
            })
    } else {
        console.log(5003, 'No token provided');
        return res.status(403).send({msg: 'No token provided.'})
    }
};

let getContact = (req, res) => {
    let pathParts = req.url.split('/')
    let contactId = pathParts[3]
    if (!contactId) {
        console.log(5004, 'No contact id provided.')
        return res.status(400).send({msg: 'No contact id provided.'})
    }

    const token = auth.getToken(req.headers)
    if (token) {
        auth.getUser(auth.getToken(req.headers))
            .then((result) => {
                const user = result.user
                Contact.findById(contactId, (err, foundContact) => {
                    if (err) {
                        console.log(5005, 'Something went wrong.');
                        return res.status(500).send({msg: 'Something went wrong.'});
                    }
                    if (!foundContact) {
                        console.log(5006, 'Contact was not found.');
                        return res.status(404).send({msg: 'Contact was not found.'});
                    }
                    console.log(5007, foundContact._id + ' founded')
                    return res.status(200).send({contact: foundContact})
                })
            })
    } else {
        console.log(5008, 'No token provided');
        return res.status(403).send({msg: 'No token provided.'})
    }
};

let addContact = (req, res) => {
    if (!req.body || !req.body.firstname || !req.body.lastname || !req.body.phonenumber) {
        console.log(6000, 'Please pass correct parameters.');
        return res.status(400).send({msg: 'Please pass correct parameters.'});
    }

    let token = auth.getToken(req.headers);
    if (token) {

        let existingContacts
        Contact.find({
            phonenumber: req.body.phonenumber
        }, (err, array) => {
            if (err) {
                console.log(6001, 'Something went wrong.');
                return res.status(500).send({msg: 'Something went wrong.'});
            }
            if (array) {
                existingContacts = array
            }
        })

        auth.getUser(auth.getToken(req.headers))
            .then((result) => {
                const user = result.user;
                const newContact = new Contact({
                    userid: user.id,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phonenumber: req.body.phonenumber,
                    email: req.body.email
                });

                for (let i of existingContacts) {
                    if (i.userid == result.user.id) {
                        console.log(6002, req.body.phonenumber + ' phonenumber already exists in your contact list.');
                        return res.status(500).send({msg: 'This phonenumber already exists in your contact list.'});
                    }
                }

                newContact.save((err) => {
                    if (err) {
                        console.log(6003, 'Something went wrong when saving new contact.');
                        return res.status(500).send({msg: 'Something went wrong when saving new contact.'});
                    }
                    console.log(6004, req.body.phonenumber + ' was saved successfully.');
                    return res.status(200).send({msg: 'New contact was saved successfully.'});
                });
            });
    }
    else {
        console.log(6005, 'No token provided');
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};

let deleteContact = (req, res) => {
    let pathParts = req.url.split('/')
    let contactId = pathParts[3]
    if (!contactId) {
        console.log(6006, 'No contact ID provided.')
        return res.status(400).send({msg: 'No contact ID provided.'})
    }

    let token = auth.getToken(req.headers);
    if (token) {
        auth.getUser(auth.getToken(req.headers))
            .then((result) => {
                const user = result.user;
                Contact.findById(contactId, (err, foundContact) => {
                    if (err) {
                        console.log(6007, 'Something went wrong.');
                        return res.status(500).send({msg: 'Something went wrong.'});
                    }
                    if (!foundContact) {
                        console.log(6008, 'Contact was not found.');
                        return res.status(404).send({msg: 'Contact was not found.'});
                    }

                    if (foundContact.userid != user.id) {
                        console.log(6009, 'You do not have right to delete this contact.');
                        return res.status(403).send({msg: 'You do not have right to delete this contact.'});
                    }
                    foundContact.remove((err) => {
                        if (err) {
                            console.log(6010, 'Something went wrong when deleting the contact.');
                            return res.status(500).send({msg: 'Something went wrong when deleting the contact.'});
                        }
                        console.log(6011, foundContact.phonenumber + ' was deleted successfully.');
                        return res.status(200).send({msg: 'Contact was deleted successfully.'});
                    })
                })
            })
    } else {
        console.log(6012, 'No token provided');
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};

let updateContact = (req, res) => {
    if (!req.body || !req.body.id || !req.body.firstname || !req.body.lastname || !req.body.phonenumber) {
        console.log(6013, 'Please pass correct parameters.');
        return res.status(400).send({msg: 'Please pass correct parameters.'});
    }
    let token = auth.getToken(req.headers);
    if (token) {
        auth.getUser(auth.getToken(req.headers))
            .then((result) => {
                const user = result.user;
                Contact.findById(req.body.id, (err, contact) => {
                    if (err) {
                        console.log(6014, 'Something went wrong.');
                        return res.status(500).send({msg: 'Something went wrong.'});
                    }
                    if (!contact) {
                        console.log(6015, 'Contact was not found.');
                        return res.status(404).send({msg: 'Contact was not found.'});
                    }
                    if (contact.userid != user.id) {
                        console.log(6016, 'You do not have right to update this contact.');
                        return res.status(403).send({msg: 'You do not have right to update this contact.'});
                    }
                    contact.firstname = req.body.firstname
                    contact.lastname = req.body.lastname
                    contact.phonenumber = req.body.phonenumber
                    contact.email = req.body.email
                    contact.save((err) => {
                        if (err) {
                            console.log(6017, 'Something went wrong when updating the contact.');
                            return res.status(500).send({msg: 'Something went wrong when updating the contact.'});
                        }
                        console.log(6018, req.body.phonenumber + ' was updated successfully.');
                        return res.status(200).send({msg: 'Contact was updated successfully.'});
                    });
                });
            });
    }
    else {
        console.log(6019, 'No token provided');
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};


module.exports = {
    getContact,
    getContacts,
    addContact,
    deleteContact,
    updateContact,

};