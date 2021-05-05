const pool = require('../database');
const helper = require('../lib/helpers');

/****** Funcion que nos permite obtener todos los productos ******/
const getAllProducts = async (req, res) => {
    console.log("entre al all de products");
    const products = await pool.query('SELECT * FROM products');
    const activeProducts = [];
    const desactiveProducts = [];
    products.forEach(product => {
        if(product.active === 1){
            activeProducts.push(product)
        }else{
            desactiveProducts.push(product)
        }
    });
    console.log(products);
    res.status(200).json({
        availables: activeProducts,
        desactives: desactiveProducts
    })
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
    res.status(200).json({
        newProduct,
        message: 'You have added a new Product to the list'
    })
}

/****** Funcion que nos permite obtener un producto ******/
const getOneProduct = async (req, res) => {
    const {product_id} = req.params;
    const id = product_id;
    const isANumber = /^\d+$/.test(id);
    console.log(isANumber);
    if(isANumber) {
        const allProductsList = await pool.query('SELECT id FROM products');
        if(helper.findCoincidenceInProductList(allProductsList, id)){
            const rows = await pool.query('SELECT * FROM products WHERE id = ?', [id]); //Si quiero acceso a este en otro endpoint como hago?
            const product = rows[0];
            console.log(product);
            res.status(200).json({
                product,
                message: 'This is the product you asked for'
            });
        }else {
            res.status(400).json({
                message: 'The product you want to get is not in List'
            })
        }
    }else {
        res.status(400).json({
            message: 'Send a number as param'
        }) 
    }
}

/****** Funcion que nos permite modificar un producto - Solo para Admins ******/
const modifyProduct = async (req, res) => {
    const {product_id} = req.params;
    const id = product_id;
    //Verificamos si el producto esta dentro de los productos de la lista
    const isANumber = /^\d+$/.test(id);
    console.log(isANumber);
    if(isANumber) {
        const allProductsList = await pool.query('SELECT id FROM products');
        if(helper.findCoincidenceInProductList(allProductsList, id)){
            const product = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
            console.log(product, 'hola');
            console.log(product[0]);
            console.log(product[0].active);
            if(product[0].active === 1) {
                const {name, description, price, photo} = req.body;
                const modifiedProduct = {
                    name, 
                    description, 
                    price, 
                    photo
                }
                await pool.query('UPDATE products set ? WHERE id = ?', [modifiedProduct, id]);
                res.status(200).json({
                    modifiedProduct,
                    message : 'You updated  one product'
                    }
                )
            }else {
                res.status(400).json({
                    message: 'The product you are trying to update is desactived please active first'
                })
            }
        }else {
            res.status(400).json({
                message: 'The product you want to update is not in List'
            })
        }
    }else {
        res.status(400).json({
            message: 'Send a number as param'
        }) 
    }
}


/****** Funcion que nos permite eliminar un producto de la lista - Solo para Admins ******/
const deleteProduct = async (req, res) => {
    const {product_id} = req.params;
    const id = product_id;
    const isANumber = /^\d+$/.test(id);
    console.log(isANumber);
    if(isANumber) {
        const allProductsList = await pool.query('SELECT id FROM products');
        if(helper.findCoincidenceInProductList(allProductsList, id)){
            //Traemos el producto en particular de la data base
            const product = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
            console.log(product, 'hola');
            console.log(product[0]);
            console.log(product[0].active);
            if(product[0].active === 1) { //Verificamos si es que no esta active ya
                const newActive = 0;
                const deleted = {
                        ...product[0],
                        active: newActive
                };
                console.log('After spread operator', deleted);
                await pool.query('UPDATE products set ? WHERE id = ?', [deleted, id]);
                res.json({
                    message: 'You deleted a product'
                });
            }else {
                console.log("Ya esta false la columna active");
                res.json({
                    message: 'This product is already inactive'
                });
            }
        }
            // await pool.query('DELETE FROM products WHERE id = ?', [id]);
        else {
            res.status(400).json({
                message: 'The product you want to delete is not in List'
            })
        }
    }else {
        res.status(400).json({
            message: 'Send a number as param'
        })
    }
}

/*************Funcion para activar un producto  *************/
const activeProduct = async (req, res) => {
    const {product_id} = req.params;
    const id = product_id;
    const isANumber = /^\d+$/.test(id);
    console.log(isANumber);
    if(isANumber) {
        const allProductsList = await pool.query('SELECT id FROM products');
        if(helper.findCoincidenceInProductList(allProductsList, id)){
            //Traemos el producto en particular de la data base
            const product = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
            console.log(product, 'hola');
            console.log(product[0]);
            console.log(product[0].active);
            if(product[0].active === 0) { //Verificamos si es que no esta active ya
                const newActive = 1;
                const actived = {
                        ...product[0],
                        active: newActive
                };
                console.log('After spread operator', actived);
                await pool.query('UPDATE products set ? WHERE id = ?', [actived, id]);
                res.json({
                    message: 'You actived a product'
                });
            }else {
                console.log("Ya esta true la columna active");
                res.json({
                    message: 'This product is already active'
                });
            }
        }
            // await pool.query('DELETE FROM products WHERE id = ?', [id]);
        else {
            res.status(400).json({
                message: 'The product you want to delete is not in List'
            })
        }
    }else {
        res.status(400).json({
            message: 'Send a number as param'
        })
    }
}

module.exports = {
    getAllProducts,
    addNewProduct,
    getOneProduct,
    modifyProduct,
    deleteProduct,
    activeProduct
}