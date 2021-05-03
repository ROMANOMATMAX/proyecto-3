const jwt = require('jsonwebtoken');
const pool = require('../database');
require('dotenv').config();

const verifyTokenMiddleWare = async (req, res, next) => {
    //Recupero el token que el usuario envio por headers
    const token = req.headers["x-access-token"];//El token debe ser enviado al hacer request en un header llamado x-access-token

    if(!token) {
        return res.status(400).json({
            auth: false,
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
                err: false,
                message: 'No user found'
            })
        }
    }catch(err) {
        res.status(500).json({
            err: true,
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


module.exports = {
    verifyTokenMiddleWare, 
    isAdmin
}



