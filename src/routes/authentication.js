const express = require('express');
const router = express.Router(); //del modulo express solo requiero el metodo Router para declarar mis rutas
const {addNewUser, showRegisterForm, checkUserProvided} = require('../controllers/authentication.controller');

//endpoints
router.get('/add', showRegisterForm)


router.post('/singup', addNewUser)

router.post('/signin', checkUserProvided)


module.exports = router;