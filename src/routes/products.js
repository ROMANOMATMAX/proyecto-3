const express = require('express');
const router = express.Router();
const pool = require('../database');
const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
const helper = require('../lib/helpers');
const {verifyTokenMiddleWare, isAdmin} = require('../middlewares/authJwt');




router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Routes
router.get('/', (req, res) => {
    res.send('Tas conectado perri');
})

router.get('/all',[verifyTokenMiddleWare],  async (req, res) => {
    console.log("entre al all de products");
    const products = await pool.query('SELECT * FROM products');
    console.log(products);
    res.json(products)

})

//Dar de alto o registrar un nuevo producto
router.post('/add',[verifyTokenMiddleWare, isAdmin], async (req, res) => {
    const {name, description, price, photo} = req.body;
    const newProduct = {
        name,
        description,
        price,
        photo
    }
    await pool.query('INSERT INTO products set ?', [newProduct]);
    res.send("Has agregado un producto a tu listado")
});

// obtener un producto por id
router.get('/:id',[verifyTokenMiddleWare, isAdmin], async(req, res) => {
    const {id} = req.params;
    const product = await pool.query('SELECT * FROM products WHERE id = ?', [id]); //Si quiero acceso a este en otro endpoint como hago?
    console.log(product);
    res.send(product);  
})
//Modificar los datos de un producto
router.post('/modify/:id', [verifyTokenMiddleWare, isAdmin], async(req, res) => {
    const {id} = req.params;
    const {name, description, price, photo} = req.body;
    const modifiedProduct = {
        name, 
        description, 
        price, 
        photo
    }
    await pool.query('UPDATE products set ? WHERE id = ?', [modifiedProduct, id]);
    res.send("You have updated a product")
})

//Borrar un producto
router.get('/delete/:id', [verifyTokenMiddleWare, isAdmin], async(req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.send('You have deleted a product from the list');
})

//leer un producto 
// router.get('/:id', async(req, res) => {
//     const {id} = req.params;
//     const product = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
//     res.send(product);
// })


//Listar todos los productos
// router.get('/all', async (req, res) => {

//     console.log("entre al all de products");
//     //Recuperp el token 
//     // const token = req.headers['x-access-token']; //El token debe ser enviado al hacer request en un header llamado x-access-token

//     // if(!token) {
//     //     console.log('Pase por aqui');
//     //     return res.status(401).json({
//     //         auth: false,
//     //         message: 'No token provided'
//     //     })
//     // }

//     // const decoded = jwt.verify(token, process.env.SECRET_KEY);

//     // console.log(decoded);
//     // const products = await pool.query('SELECT * FROM products');
//     // console.log(products);
//     // res.send('Has consultado todos los productos')
// });

module.exports = router;
