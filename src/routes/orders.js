const express = require('express');
const router = express.Router();
const {verifyTokenMiddleWare, isAdmin} = require('../middlewares/authJwt');
const {createNewOrder, modifyOrderStatus, getAllOrders, getOneOrder, deleteOrder, modifyOrderBeforeConfirmation} = require('../controllers/orders.controller');
const {addNewProductToOrder, removeProductFromOrder} = require('../controllers/orderToProduct.controller');


//Routes
router.get('/', (req, res) => {
    res.send('Tas conectado perri');
})

//Endpoint para crear una nueva orden
router.post('/add', verifyTokenMiddleWare,createNewOrder)

//Endpoint para modificar el estado de un pedido - solo para Admins
router.put('/modify-status', [verifyTokenMiddleWare, isAdmin], modifyOrderStatus)

//Endpoint que permite obtener todas las ordenes existentes - solo para Admins
router.get('/all', [verifyTokenMiddleWare, isAdmin], getAllOrders)

//Endpoint que permite obtener una orden y todos sus datos relacionados
router.get('/:id', [verifyTokenMiddleWare], getOneOrder) //Una orden puede ser consultada por un usuario normal o un usuario ADMIN los dos pueden verla

//Endpoint que permite remover un producto de la orden
router.delete('/remove-product-from-order', [verifyTokenMiddleWare], removeProductFromOrder)

//Endpoint que permite borrar una orden - solo para Admins
router.delete('/:id', [verifyTokenMiddleWare, isAdmin], deleteOrder)

//Endpoint que permite añadir un nuevo producto a la orden - solo para Admins
router.post('/add-product-to-order', [verifyTokenMiddleWare], addNewProductToOrder)

//Endpoint que permite modificar la orden al confirmar el pedido - por ejemplo se podria modificar la direccion, el metodo de pago 
router.put('/last-modification', [verifyTokenMiddleWare], modifyOrderBeforeConfirmation);


module.exports = router;