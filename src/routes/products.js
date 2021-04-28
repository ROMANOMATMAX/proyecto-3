const express = require('express');
const router = express.Router();
const {verifyTokenMiddleWare, isAdmin} = require('../middlewares/authJwt');
const {getAllProducts, addNewProduct, getOneProduct, modifyProduct, deleteProduct} = require('../controllers/products.controller');


//Routes
router.get('/', (req, res) => {
    res.send('Tas conectado perri');
})


//Endpoint que nos permite tener acceso a todos los productos de la lista
router.get('/all',[verifyTokenMiddleWare], getAllProducts)

//Endpoint que nos permite añadir un nuevo producto a la lista - Solo para Admins
router.post('/add',[verifyTokenMiddleWare, isAdmin], addNewProduct);

//Endpoint que nos permite obtener un producto de la lista
router.get('/:id',[verifyTokenMiddleWare], getOneProduct)

//Endpoint que nos permite modificar los datos de un producto - Solo para Admins
router.put('/modify/:id', [verifyTokenMiddleWare, isAdmin], modifyProduct)

//Endpoint que nos permite borrar un producto de la lista - Solo para Admins
router.delete('/delete/:id', [verifyTokenMiddleWare, isAdmin], deleteProduct)


module.exports = router;
