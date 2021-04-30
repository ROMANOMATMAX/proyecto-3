const { response } = require('express');
const pool = require('../database');
const helper = require('../lib/helpers');

/******Funcion que agrega productos a la orden / Tambien genera la orden si esta aun no existe ******/
const createNewOrder = async (req, res) => {

    //minimamente el id del usuario que seguro esta en el front almacenado en algun lado- por el momento voy a considerar que lo obtengo al validar el token
    const userID = req.app.get('userId');//Este es una variable global que guarda el id generada por el verifyTokenMiddlaware luego de autenticar el usuario
    
    console.log(userID);

    //Genero el nuevo objeto orden que sera insertado en la DB - Esta es una orden con datos cargados por default luego podran actualizarse antes de confirmar el pedido
    //El unico dato relevante aqui será el user_id que ya me asocia esa orden al usuario correcto
    const newOrder = {
        id: 0,
        user_id: req.app.get('userId'), 
        creation_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        payment_kind: 'Efectivo',
        total_amount: 0.00,
        status: 'nuevo',
        address: req.app.get('userAddress')
    }
    //Creo una nueva orden en la DB
    const order = await pool.query('INSERT INTO orders set ?', [newOrder]);

    res.json({
        orderId: order.insertId,
        message: 'You have created a new order'
    });
}


const modifyOrderStatus = async (req, res) => {
    //De alguna manera el servidor deberia recibir el nuevo valor para el status de la orden
    //Al presionar un valor hara un pedido ajax que tomara el value de algun tag me imagino 
    //Podria agregar un check para ver si realmente existe una orden
    const {newStatus, orderId} = req.body; 
    console.log(newStatus);
    //Necesitas en primer lugar verificar que el orderId que te pasaron existe 
    const allOrdersList = await pool.query('SELECT id FROM orders');
    if(helper.findCoincidenceInOrderList(allOrdersList, orderId)) {
        console.log("La orden existe");
        const rows = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        const order = rows[0];
        
        const {id, user_id, creation_date, payment_kind, total_amount, status} = order;

        const orderModified = {
            id, 
            user_id, 
            creation_date,
            payment_kind,
            total_amount,
            status: newStatus
        }
        try {
            await pool.query('UPDATE orders set ? WHERE id = ?', [orderModified, orderId]);

            res.json({
                status,
                orderId,
                order
            })
        }catch(err) {
            res.json({
                err
            })
        }
    }else {
        res.status(400).json({
            message: 'The order you want to update does not exist'
        })
    }
    
}


/****** Funcion que responde con todas las ordenes - solo para Admins ******/
const getAllOrders = async (req, res) => {
    const orders = await pool.query('SELECT * FROM orders');
    console.log(orders);
    res.json(orders)
}


/****** Funcion que nos entrega una orden - con todos los datos relacionados a través de uniones de tablas ******/
const getOneOrder = async (req, res) => {
    const {id} = req.params;
    const isANumber = /^\d+$/.test(id);
    console.log(isANumber);
    if(isANumber) {
        const allOrdersList = await pool.query('SELECT id FROM orders');
        if(helper.findCoincidenceInOrderList(allOrdersList, id)) {
            const rows = await pool.query('SELECT o.id, o.creation_date, o.status, o.total_amount, u.fullname, u.address, p.name, p.price, p.description\
            FROM orders o INNER JOIN orderstoproducts otp ON o.id = otp.order_id INNER JOIN users u ON o.user_id = u.id\
            INNER JOIN products p ON otp.product_id = p.id WHERE o.id = ?', [id]); //Si quiero acceso a este en otro endpoint como hago?
            console.log(rows);
            // const order = rows[0];
            // console.log(order);
            res.json({
                rows,
                productsAmount: rows.length,
                message: 'This is the order you asked for'
            });
        }else{
            res.status(400).json({
                message: 'The order you want to get does not exist'
            })
        }
    }else {
        res.status(400).json({
            message: 'Send a number as param'
        }) 
    }
    //Consultar una orden es consultar algo que puede tener multiples productos adentro por lo tanto puede estar conformada por varias rows
}


/****** Funcion para actualizar los datos de una orden / datos de acceso al usuario comun *******/
const modifyOrderBeforeConfirmation = async (req, res) => {
    
    // creation_date
    //Address no existe en la tabla order / osea que de alguna manera habria que modificar el adress del usuario??
    //Podria agregarle una direccion a la table order la cual por default tenga la direccion del usuario pero que pueda ser modificable
    //Ojo con el create_date por que deberia generarse cuando el usuario confirma la orden -- creo que es el ultimo cambio que deberia realizarse
    const creation_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const {address, payment_kind, orderId} = req.body; //En el body del POST tendre la direccion (que por defecto en el front yo pondria la del user registrado) y el metodo de pago que por defecto tmb lo iniciaria en efectivo
    const rows = await pool.query('SELECT * FROM orders WHERE id= ?', [orderId]);
    const order = rows[0];
    const lastModifiedOrder = {
        ...order,
        creation_date,
        address,
        payment_kind
    }

    console.log(lastModifiedOrder);

    //Deberia actualizar este dato en la BD
    pool.query('UPDATE orders set ? WHERE id = ?', [lastModifiedOrder, orderId])

    res.json({
        lastModifiedOrder,
        message: `You updated the order ${orderId}`
    })
}

//Necesito una funcion que le permita al admin borrar una orden eliminarla de DB
//Cual es el problema que al borrar una orden esta se encuentra en otra tabla como child y puede haber problema de que esos elementos
//queden sin padre para esto hay que hacer una configuracion on cascade

/****** Funcion que permite borrar una orden - Solo para Admins ******/
const deleteOrder = (req, res) => {
    const {id} = req.params;
    pool.query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({
        message: `you deleted the order ${id}`
    })
}


module.exports = {
    createNewOrder,
    modifyOrderStatus, 
    getAllOrders, 
    getOneOrder, 
    deleteOrder,
    modifyOrderBeforeConfirmation
}