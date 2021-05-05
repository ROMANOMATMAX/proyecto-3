const jwt = require('jsonwebtoken');
const pool = require('../database');
require('dotenv').config();

const verifyTokenMiddleWare = async (req, res, next) => {
    //Recupero el token que el usuario envio por headers
    const token = req.headers["x-access-token"];//El token debe ser enviado al hacer request en un header llamado x-access-token

    if(!token) {
        return res.status(400).json({
            message: 'No token provided'
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const idDecoded = decoded.id;
        req.userId = idDecoded; //Esto es muy importante por que va a permitir tener acceso al id a cualquier funcion que tenga req de aqui en adelante
        req.app.set('userId', idDecoded);//Hacemos global el id usuario autenticado
        const rows = await pool.query('SELECT * FROM users WHERE id = ?', [idDecoded]);
        console.log(rows);
        if(rows.length > 0) {//Existe el usuario
            req.app.set('userAddress', rows[0].address);
            next()
        }else {
            //No existe el usuario
            return res.status(404).json({
                message: 'No user found'
            })
        }
    }catch(err) {
        res.status(500).json({
            message: `${err}`
        })
    }
}


const   isAdmin = async (req, res, next) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    const user = rows[0];
    if(user.role === 'ADMIN') {
        next();
    }else {
        res.status(403).json({
            message: 'Require admin role'
        })
    }
}

const createNewOrderMiddleWare = async (req, res, next) => {
    console.log("Estoy entrando al middleware de create order");
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
    req.orderId =order.insertId;
    req.app.set('orderId', order.insertId);
    console.log(req.app.get('orderId'));
    next();
}

module.exports = {
    verifyTokenMiddleWare, 
    isAdmin,
    createNewOrderMiddleWare
}



