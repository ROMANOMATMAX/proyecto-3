const { response } = require('express');
const pool = require('../database');
const helper = require('../lib/helpers')

/***** Funcion que nos permite agregar un nuevo producto a la orden ******/
const addNewProductToOrder = async (req, res) => {
    
    //Recibo a través del body el id de la orden y el id del producto
    const orderId = req.app.get('orderId')
    const {productId} = req.body;
    const allOrderList = await pool.query('SELECT id FROM orders')
    if(helper.findCoincidenceInOrderList(allOrderList, orderId)) {
        //Consulto si la orden esta activa - si ya no lo esta no puedo tocarla
        const activeColumn = await pool.query('SELECT active FROM orders WHERE id = ?', [orderId]);
        console.log(activeColumn[0].active);
        if(activeColumn[0].active === 1){
            const allProductsList = await pool.query('SELECT id FROM products')
            if(helper.findCoincidenceInProductList(allProductsList, productId)){
                console.log('El producto existe');
                const rows = await pool.query('SELECT name, price FROM products WHERE id = ?', [productId])
                const product = rows[0];
                //Creo el nuevo objeto a introducir en DB
                const newProductOrder = {
                    id: 0,
                    order_id: orderId,
                    product_id: productId,
                    product_name: product.name,
                    product_price: product.price
                }
                //Agrego el nuevo producto a la orden
                const newProductToOrder = await pool.query('INSERT INTO orderstoproducts set ?', [newProductOrder]);
                //Consulto todos los productos de la orden 
                // const allProductInYourOrder = await pool.query('SELECT otp.order_id, otp.product_id, p.name, p.price FROM orderstoproducts otp INNER JOIN products p ON otp.product_id = p.id\
                // WHERE otp.order_id = ?', [orderId]);
                const allProductInYourOrder = await pool.query('SELECT * FROM orderstoproducts WHERE order_id = ?', [orderId]);
                console.log(allProductInYourOrder);
                let totalAmount = 0;
                //Sumo los precios de todos los productos de la orden
                allProductInYourOrder.forEach(product => {
                    totalAmount = totalAmount + product.product_price;
                });
                console.log(totalAmount); //This is your new total amount order
                //Actualizo el monto total de la orden 
                await pool.query('UPDATE orders SET total_amount = ? WHERE id = ?', [totalAmount, orderId]);
                res.status(200).json({
                    productToOrderId: newProductToOrder.insertId,
                    message: 'You have added a product to your order'
                })
            }else{ 
                res.status(400).json({
                    message: 'The product you want to add is not in List'
                })
            } 
        }else {
            res.status(400).json({
                message: 'The order you want to add a product is not actived'
            })
        }
    }else {
        res.status(400).json({
            message: 'The order you want to add a product does not exist'
        })
    }   
}

/***** Funcion que nos permite borrar un producto a la orden ******/
const removeProductFromOrder = async (req, res) => {
    console.log(req.app.get('orderId'), );//Aca ya tengo la ordenId que se encuentra activa para el usuario
    //recupero el productId que llega por params
    const {product_id} = req.params;
    const isANumber = /^\d+$/.test(product_id);
    console.log(isANumber);
    if(isANumber) {
        const productId = parseInt(product_id);
        const orderId = req.app.get('orderId');

        // const {orderId, productId} = req.body;
        console.log(orderId);
        //Consulto si realmente el id corresponde a una orden valida existente
        const orders = await pool.query('SELECT id FROM orders');
        if(helper.findCoincidenceOrders(orders, orderId)) {
            console.log("La orden existe");
            const activeColumn = await pool.query('SELECT active FROM orders WHERE id = ?', [orderId]);
            console.log(activeColumn[0].active);
            if(activeColumn[0].active === 1){
                //Una vez superada esta validacion vamos a validar si el producto realmente existe en esa orden
                //Traigo todas los productos relacionado a esa orden
                const productsInYourOrder = await pool.query('SELECT * FROM orderstoproducts WHERE order_id = ?', [orderId]);
                //Verifico que el productoId que llego por body corresponde realmente a un producto de esta orden
                if(helper.findCoincidenceProducts(productsInYourOrder, productId)) {
                    console.log("La orden existe y el producto pertenece a la orden");
                    //Pregunto si a esa orden no le queda un solo producto / si le quedará uno ademas de borrar el prod debo borrar la orden
                    if(productsInYourOrder.length > 1) {
                        await pool.query('DELETE FROM orderstoproducts WHERE order_id = ? AND product_id = ? LIMIT 1', [orderId, productId]); //Need limit 1 for only delete one item
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
                        await pool.query('UPDATE orders SET active = ? WHERE id = ?', [0,orderId]);
                        return res.status(200).json({
                            message: 'You removed one item from the order and cause it was the last one also the order was deleted'
                        })
                    }
                }else {
                    res.status(400).json({
                        message: "The product you want to remove is not in this order"
                    });
                }
            }else{
                res.status(400).json({
                    message: 'The order you want to add a product is not actived'
                })
            }
        }else {
            res.status(400).json({
                message: 'The order you are sending in request body doesnt exist or was deleted'
            })
        }
    }else{
        res.status(400).json({
            message: 'Send a number as param'
        }) 
    }
}

module.exports = {
    addNewProductToOrder,
    removeProductFromOrder
}