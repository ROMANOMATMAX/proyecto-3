const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const helper = {

}

helper.verifyToken = (token) => {
    if(!token) {
        console.log('Pase por aqui');
        return 'No token provided';
    }
    let decoded;
    try { //Necesito si o si un try / catch para poder contemplar el posible error  de token invalido
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch(err) {
            return 'Wrong token'
      }
      console.log(decoded);
    return decoded.id;
}


module.exports = helper;

