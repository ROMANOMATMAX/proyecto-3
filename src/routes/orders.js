const express = require('express');
const router = express.Router();
const {verifyTokenMiddleWare, isAdmin, createNewOrderMiddleWare} = require('../middlewares/authJwt');
const {createNewOrder, modifyOrderStatus, getAllOrders, getOneOrder, deleteOrder, modifyOrderBeforeConfirmation, activeOrder} = require('../controllers/orders.controller');
const {addNewProductToOrder, removeProductFromOrder} = require('../controllers/orderToProduct.controller');
const {statusOrderModificationSchema, lastOrderModificationSchema, orderToProductSchema} = require('../middlewares/schemas');
const validateResourceMW = require('../middlewares/validateSchemas');
//Routes
router.get('/', (req, res) => {
    res.send('Tas conectado perri');
})

//Endpoint para crear una nueva orden
router.post('/add', [verifyTokenMiddleWare, createNewOrderMiddleWare], createNewOrder)

//Endpoint para modificar el estado de un pedido - solo para Admins
router.put('/modify-status', [verifyTokenMiddleWare, isAdmin, validateResourceMW(statusOrderModificationSchema)], modifyOrderStatus)

//Endpoint que permite obtener todas las ordenes existentes - solo para Admins
router.get('/all', [verifyTokenMiddleWare, isAdmin], getAllOrders)

//Endpoint que permite obtener una orden y todos sus datos relacionados
router.get('/:id', [verifyTokenMiddleWare], getOneOrder) //Una orden puede ser consultada por un usuario normal o un usuario ADMIN los dos pueden verla

//Endpoint que permite remover un producto de la orden
router.delete('/remove-product-from-order/:product_id', [verifyTokenMiddleWare], removeProductFromOrder)

//Endpoint que permite modificar la orden al confirmar el pedido - por ejemplo se podria modificar la direccion, el metodo de pago 
router.put('/last-modification', [verifyTokenMiddleWare, validateResourceMW(lastOrderModificationSchema)], modifyOrderBeforeConfirmation);

//Endpoint que permite borrar una orden - solo para Admins
router.put('/:id', [verifyTokenMiddleWare, isAdmin], deleteOrder)

//Endpoint que permite añadir un nuevo producto a la orden - solo para Admins
router.post('/add-product-to-order', [verifyTokenMiddleWare, validateResourceMW(orderToProductSchema)], addNewProductToOrder)

//Endpoint que te permite activar una orden que esta desactived
router.put('/active/:id', [verifyTokenMiddleWare, isAdmin], activeOrder)

module.exports = router;