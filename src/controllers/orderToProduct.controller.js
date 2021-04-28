const pool = require('../database');


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
    const newProductToOrder = pool.query('INSERT INTO orderstoproducts set ?', [newProductOrder]);
    res.json({
        productToOrderId: newProductOrder.insertId,
        message: 'You have added a product to your order'
    })
}

/***** Funcion que nos permite borrar un producto a la orden ******/
const removeProductFromOrder = async (req, res) => {
    
    const {orderId, productId} = req.body;
    //Antes de borrar consultar de ordertoproducts todos los elementos que tengan id = orderId
    //Si el resultado de la consulta anterior es solo 1 elemento entonces no solo borrar el elemento de ordertoproducts sino tambien borrar la orden de la tabla orders
    await pool.query('DELETE FROM orderstoproducts WHERE order_id = ? AND product_id = ?', [orderId, productId]);

    res.json({
        message: 'product removed succesfully from order / contemplar caso que sea el ultimo producto y debe tmb borrar la orden'
    })
}

module.exports = {
    addNewProductToOrder,
    removeProductFromOrder
}