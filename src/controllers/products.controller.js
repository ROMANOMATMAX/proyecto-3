const pool = require('../database');


/****** Funcion que nos permite obtener todos los productos ******/
const getAllProducts = async (req, res) => {
    console.log("entre al all de products");
    const products = await pool.query('SELECT * FROM products');
    console.log(products);
    res.json(products)
}

/****** Funcion que nos permite añadir un nuevo producto a la lista - Solo para Admins ******/
const addNewProduct = async (req, res) => {

    const {name, description, price, photo} = req.body;
    const newProduct = {
        name,
        description,
        price,
        photo
    }
    await pool.query('INSERT INTO products set ?', [newProduct]);
    res.json({
        newProduct,
        message: 'You have added a new Product to the list'
    })
}

/****** Funcion que nos permite obtener un producto ******/
const getOneProduct = async (req, res) => {
    const {id} = req.params;
    const rows = await pool.query('SELECT * FROM products WHERE id = ?', [id]); //Si quiero acceso a este en otro endpoint como hago?
    const product = rows[0];
    console.log(product);
    res.json({
        product,
        message: 'This is the product you asked for'
    });
}

/****** Funcion que nos permite modificar un producto - Solo para Admins ******/
const modifyProduct = async (req, res) => {
    const {id} = req.params;
    const {name, description, price, photo} = req.body;
    const modifiedProduct = {
        name, 
        description, 
        price, 
        photo
    }
    await pool.query('UPDATE products set ? WHERE id = ?', [modifiedProduct, id]);
    res.json({
        modifiedProduct,
        message : 'You updated  one product'
        }
    )
}


/****** Funcion que nos permite eliminar un producto de la lista - Solo para Admins ******/
const deleteProduct = async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({
        message: 'You deleted a product'
    });
}

module.exports = {
    getAllProducts,
    addNewProduct,
    getOneProduct,
    modifyProduct,
    deleteProduct
}