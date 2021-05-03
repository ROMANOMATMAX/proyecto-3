const { response } = require('express');
const pool = require('../database');
const helper = require('../lib/helpers')

/***** Funcion que nos permite agregar un nuevo producto a la orden ******/
const addNewProductToUser = async (req, res) => {

    //Recibo a través del body el id de la orden y el id del producto
    const {userId, productId} = req.body;
    const allProductsList = await pool.query('SELECT id FROM products');
    if(helper.findCoincidenceInProductList(allProductsList, productId)){
        const allUserProducts = await pool.query('SELECT product_id FROM producttouser WHERE user_id = ?', [userId]);
        if(helper.findCoincidenceUsers(allUserProducts, productId)){
            res.status(200).json({
                message: 'This product is already in list'
            })
        }else {
            //Creo el nuevo objeto a introducir en DB
            const newProductUser = {
                id: 0,
                user_id: userId,
                product_id: productId
            }
            const newProductToUser = await pool.query('INSERT INTO  producttouser set ?', [newProductUser]);
            res.status(200).json({
                productToUserId: newProductToUser.insertId,
                message: 'You have added a product to the user'
            })
        }
    }else{
        res.status(400).json({
            message: 'The product you want to add to favorite is not in List'
        })
    }
}

/***** Funcion que nos permite borrar un producto a la orden ******/
const removeProductFromUser = async (req, res) => {
    const {userId, productId} = req.body;
    const allUserProducts = await pool.query('SELECT product_id FROM producttouser WHERE user_id = ?', [userId]);
    if(helper.findCoincidenceUsers(allUserProducts, productId)){
        await pool.query('DELETE FROM producttouser WHERE user_id = ? AND product_id = ?',[userId, productId] );
        res.status(200).json({
            message: `You have deleted from favorite the ${productId} product`
        })
    }else {
        res.status(400).json({
            message: 'This product is not in favorite for this user'
        })
    }
}

module.exports = {
    addNewProductToUser,
    removeProductFromUser
}