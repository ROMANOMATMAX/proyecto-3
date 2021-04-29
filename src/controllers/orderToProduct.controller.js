const { response } = require('express');
const pool = require('../database');
const helper = require('../lib/helpers')

/***** Funcion que nos permite agregar un nuevo producto a la orden ******/
const addNewProductToOrder = async (req, res) => {

    //Recibo a través del body el id de la orden y el id del producto
    const {orderId, productId} = req.body;

    //Creo el nuevo objeto a introducir en DB
    const newProductOrder = {
        order_id: orderId,
        product_id: productId
    }

    //Insertamos este nuevo producto en la orden -- DB
    try {
        //Agrego el nuevo producto a la orden
        const newProductToOrder = await pool.query('INSERT INTO orderstoproducts set ?', [newProductOrder]);
        //Consulto todos los productos de la orden 
        const allProductInYourOrder = await pool.query('SELECT otp.order_id, otp.product_id, p.name, p.price FROM orderstoproducts otp INNER JOIN products p ON otp.product_id = p.id\
        WHERE otp.order_id = ?', [orderId]);
        console.log(allProductInYourOrder);
        let totalAmount = 0;
        //Sumo los precios de todos los productos de la orden
        allProductInYourOrder.forEach(product => {
            totalAmount = totalAmount + product.price;
        });
        console.log(totalAmount); //This is your new total amount order
        //Actualizo el monto total de la orden 
        await pool.query('UPDATE orders SET total_amount = ? WHERE id = ?', [totalAmount, orderId]);
        res.status(200).json({
            productToOrderId: newProductOrder.insertId,
            message: 'You have added a product to your order'
        })
        //Añadido el nuevo producto necesito controlar nuevamente cuales son los productos dentro de la orden y su precio
    }catch(err) {
        res.status(500).json({
            message: `${err}`
        })
    }
    
}

/***** Funcion que nos permite borrar un producto a la orden ******/
const removeProductFromOrder = async (req, res) => {
    
    const {orderId, productId} = req.body;
    //Consulto si realmente el id corresponde a una orden valida existente
    const orders = await pool.query('SELECT id FROM orders');
    if(helper.findCoincidenceOrders(orders, orderId)) {
        console.log("La orden existe");
        //Una vez superada esta validacion vamos a validar si el producto realmente existe en esa orden
        //Traigo todas los productos relacionado a esa orden
        const productsInYourOrder = await pool.query('SELECT * FROM orderstoproducts WHERE order_id = ?', [orderId]);
        //Verifico que el productoId que llego por body corresponde realmente a un producto de esta orden
        if(helper.findCoincidenceProducts(productsInYourOrder, productId)) {
            console.log("La orden existe y el producto pertenece a la orden");
            //Pregunto si a esa orden no le queda un solo producto / si le quedará uno ademas de borrar el prod debo borrar la orden
            if(productsInYourOrder.length > 1) {
                await pool.query('DELETE FROM orderstoproducts WHERE order_id = ? AND product_id = ? LIMIT 1', [orderId, productId]); 
                //Si un producto se remueve de la orden debe recalcularse el monto total para ellos consultamos todos los prods de la orden y sus precios
                const allProductInYourOrder = await pool.query('SELECT otp.order_id, otp.product_id, p.name, p.price FROM orderstoproducts otp INNER JOIN products p ON otp.product_id = p.id\
                WHERE otp.order_id = ?', [orderId]);
                let totalAmount = 0;
                //Sumo los precios de todos los productos de la orden
                allProductInYourOrder.forEach(product => {
                    totalAmount = totalAmount + product.price;
                });
                console.log(totalAmount); //This is your new total amount order
                //Actualizo el monto total de la orden 
                await pool.query('UPDATE orders SET total_amount = ? WHERE id = ?', [totalAmount, orderId]);
                
                return res.status(200).json({
                    message: 'You removed one item from the order'
                })
            }else {
                await pool.query('DELETE FROM orderstoproducts WHERE order_id = ? AND product_id = ?', [orderId, productId]); 
                await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
                return res.status(200).json({
                    message: 'You removed one item from the order and cause it was the last one also the order was deleted'
                })
            }
        }else {
            res.status(400).json({
                message: "The product you want to remove is not in this order"
            });
        }
    }else {
        res.status(400).json({
            message: 'The order you are sending in request body doesnt exist or was deleted'
        })
    }
}

module.exports = {
    addNewProductToOrder,
    removeProductFromOrder
}