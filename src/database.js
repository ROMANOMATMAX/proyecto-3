const mysql = require('mysql');
const {promisify} = require('util')
const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection( (err, connection) => {
    if(err) {//contemplo posibles errores 
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            console.log("DATABASE CONNECTION WAS CLOSED"); 
        } 
        if(err.code === 'ER_CON_COUNT_ERROR') { 
            console.log("DATABASE HAS TO MANY CONNECTIONS"); 
        } 
        if(err.code === 'ECONNREFUSED') { 
            console.log("DATABASE CONNECTION WAS REFUSED"); 
        } 
    } 
    if(connection) {     
        connection.release(); //CON ESTO REALMENTE EMPIEZA LA CONNECCION 
        console.log("DB is Connected"); 
        return; 
    } 
})

pool.query = promisify(pool.query);

module.exports = pool;