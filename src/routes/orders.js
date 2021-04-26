const express = require('express');
const router = express.Router();
const pool = require('../database');
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Routes
router.get('/', (req, res) => {
    res.send('Tas conectado perri');
})

router.post('/add', (req, res) => {
    //Necesito saber que usuario este logueado y traer sus datos para iniciar una orden
})

module.exports = router;