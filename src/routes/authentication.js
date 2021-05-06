const express = require('express');
const router = express.Router(); //del modulo express solo requiero el metodo Router para declarar mis rutas
const {verifyTokenMiddleWare, isAdmin} = require('../middlewares/authJwt');
const {addNewUser, checkUserProvided, showAllUsers, deleteUser, activeUser, modifyRoleUser} = require('../controllers/authentication.controller');
const {addNewProductToUser, removeProductFromUser, getFavorites} = require('../controllers/productToUser.controller');
const {userSignUpSchema, userSignInSchema, favoriteProductSchema, modifyUserRoleSchema} = require('../middlewares/schemas');
const validateObjectMW = require('../middlewares/validateSchemas');
const validateResourceMW = require('../middlewares/validateSchemas');

//endpoints


//Endpoint que muestra todos los usuarios -solo para Admins
router.get('/all', [verifyTokenMiddleWare, isAdmin],showAllUsers)

//Endpoint que permite registrarse
router.post('/signup', validateResourceMW(userSignUpSchema),addNewUser)

//Endpoint que permite loguearse
router.post('/signin', validateResourceMW(userSignInSchema),checkUserProvided)

router.post('/add-product-to-user', [verifyTokenMiddleWare, validateResourceMW(favoriteProductSchema)], addNewProductToUser)

router.delete('/remove-product-to-user/:product_id', [verifyTokenMiddleWare], removeProductFromUser)

router.get('/favorites/:user_id', [verifyTokenMiddleWare], getFavorites)

router.put('/desactive/:user_id',[verifyTokenMiddleWare, isAdmin], deleteUser)

router.put('/active/:user_id',[verifyTokenMiddleWare, isAdmin], activeUser)

router.put('/roleManager', [verifyTokenMiddleWare, isAdmin, validateResourceMW(modifyUserRoleSchema)], modifyRoleUser)

module.exports = router;