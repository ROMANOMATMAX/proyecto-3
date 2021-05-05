const express = require('express');
const router = express.Router();
const {verifyTokenMiddleWare, isAdmin} = require('../middlewares/authJwt');
const {getAllProducts, addNewProduct, getOneProduct, modifyProduct, deleteProduct, activeProduct} = require('../controllers/products.controller');
const {productSchema} = require('../middlewares/schemas');
const validateResourceMW = require('../middlewares/validateSchemas');

//Routes
router.get('/', (req, res) => {
    res.send('Tas conectado perri');
})


//Endpoint que nos permite tener acceso a todos los productos de la lista
router.get('/all',[verifyTokenMiddleWare], getAllProducts)

//Endpoint que nos permite añadir un nuevo producto a la lista - Solo para Admins
router.post('/add',[verifyTokenMiddleWare, isAdmin, validateResourceMW(productSchema)], addNewProduct);

//Endpoint que nos permite obtener un producto de la lista
router.get('/:product_id',[verifyTokenMiddleWare], getOneProduct)

//Endpoint que nos permite modificar los datos de un producto - Solo para Admins
router.put('/modify/:product_id', [verifyTokenMiddleWare, isAdmin, validateResourceMW(productSchema)], modifyProduct)

//Endpoint que nos permite borrar un producto de la lista - Solo para Admins
router.put('/desactive/:product_id', [verifyTokenMiddleWare, isAdmin], deleteProduct)

//Endpoint que nos permite borrar un producto de la lista - Solo para Admins
router.put('/active/:product_id', [verifyTokenMiddleWare, isAdmin], activeProduct)


module.exports = router;
