const express = require('express');
const auth = require('../app/auth/auth');
const app = require('../app/contact/app');
const admin = require('../app/contact/admin');

const router = express.Router();

router.post('/register', auth.register)
router.post('/login', auth.login)


router.get('/v1/contact/:id', app.getContact)
router.get('/v1/contact', app.getContacts)
router.post('/v1/contact', app.addContact)
router.delete('/v1/contact/:id', app.deleteContact)
router.put('/v1/contact', app.updateContact)

router.get('/v1/admin', admin.getRegisteredUsers)


module.exports = router;