const jwt = require('jsonwebtoken');//Requiero el modulo jsonwebtoken que generará el token una vez autenticado el usuario
const bcrypt = require('bcryptjs');//Requiero el modulo bcryptjs que encryptara la contraseña para que no vaya descubierta a DB
const pool = require('../database');//Exporto la conexion con la DB para poder hacer consultas
require('dotenv').config();
const helper = require('../lib/helpers');


/******Funcion que permite acceder a todos los usuarios registrados solo disponible para admin*****/
const showAllUsers = async (req, res) => {
    const users = await pool.query('SELECT * FROM users');

    const activeUsers = [];
    const desactiveUsers = [];
    users.forEach(user => {
        if(user.active === 1){
            activeUsers.push(user)
        }else{
            desactiveUsers.push(user)
        }
    });
    console.log(users);
    res.json({
        actives: activeUsers,
        desactives: desactiveUsers
    })
}


/******Funcion para añadir un nuevo user a la DB y otorgarle su token*****/
const addNewUser = async (req, res) => {

    const { id, username, fullname, email, phone, address, password, token, role } = req.body; //Destructuring a los datos enviados en el body del request

    //Antes de añadir un nuevo usuario verifico que no este ya registrado en la base de datos 

    let rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    // console.log("hola soy el user found" + " " + userFound);
    console.log(rows.length);
    if(rows.length > 0) { //Hubo coincidencia por lo que el email ya esta usado
        const userFound = rows[0];
        console.log(userFound);
        return res.json({
            error: true,
            message: "This email is already used"
        })
    }else { //Es un nuevo email y crearemos un nuevo usuario
        //Armo el nuevo objeto a colocar en la DB - los nombres deben ser iguales a los nombres de las columnas en mi db
        const newUser = {
            id, 
            username,
            fullname,
            email, 
            phone,
            address,
            password
        }

         //Mando o no mando role? 
        if(!role) {
            console.log("no enviaste el role papa");
            //Por defecto te asignare el role COSTUMER
            newUser.role = "COSTUMER";
        }else {
            console.log("Si enviaste el role y en teoria deberia ser admin");
            newUser.role = role;
        }

        //Antes de insertar el objeto en DB debo encryptar la clave del nuevo usuario
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);//Clave del nuevo usuario encryptada
        console.log(newUser);
        //Introducimos el nuevo objeto en la DB
        let queryResponse;
        try {
            queryResponse =  await pool.query('INSERT INTO users set ?', [newUser]) //Insertamos a la DB, ojo dentro de la variable queryResponse tenemos un parametro insertId que nos da el id que le dio a este nuevo dato
            const tokenJWT = jwt.sign({id: queryResponse.insertId}, process.env.SECRET_KEY, { //En nuestro caso el token se genera apartir del id
                expiresIn: 60 * 60 * 24
            })
    
            //Enviamos el token al cliente
            res.json({
                auth: true,
                tokenJWT
            });
        }catch(err) {
            console.log(err);
            res.send(err);
        }
    }
}



/********Funcion para logear un usuario ya existente*********/
const checkUserProvided = async (req, res) => {
    
    const {email, password} = req.body; //Destructuring a los datos enviados en el body del request
    //Verifico si el email corresponde a un usuario registrado
    try {
        let rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log(rows.length);
        if(rows.length > 0) { //Hubo coincidencia por lo que el email corresponde a un usuario registrado
            const userFound = rows[0];
            console.log(userFound);
            //El password de userFound esta cifrado por que asi se guardo en la DB debo mediante bcrypt compararlo con el pass que introdujó el usuario
            const passwordValid = await bcrypt.compare(password, userFound.password);
            //Chequeamos si el password del usuario es el correcto 
            if(passwordValid) {
                if(userFound.active === 1) {
                    //Se logueo con exito por lo tanto debo entregar el token al usuario para que este habilitado a hacer otras consultas
                    const tokenJWT = jwt.sign({id: userFound.id}, process.env.SECRET_KEY, { //En nuestro caso el token se genera apartir del id
                        expiresIn: 60 * 60 * 24
                    })
            
                    //Enviamos el token al cliente
                    res.status(200).json({
                        auth: true,
                        message: `${tokenJWT}`
                    });
                }else {
                    res.status(400).json({
                        auth: false,
                        message: `This user is inactive - maybe you want to recover your account`
                    });
                }
            }else {
                res.status(400).json({
                    error: true,
                    message: 'Invalid password'
                });
            }
        }else { //Es un nuevo email y crearemos un nuevo usuario
            res.status(400).json({
                error: true,
                message: 'Invalid email'
            });
        }    
    }catch(err) {
        res.status(500).json({
            error: true,
            message: `${err}`
        })
    }
    
}

const deleteUser = async (req, res) => {
    const {id} = req.params; //Recuperas el id que te llega por params
    const isANumber = /^\d+$/.test(id);//Verificas si realmente lo que te enviaron por param fue un numero
    console.log(isANumber);
    if(isANumber) {
        const allUsersList = await pool.query('SELECT id FROM users');
        if(helper.findCoincidenceInUserList(allUsersList, id)){
            const user = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            console.log(user, 'hola');
            console.log(user[0]);
            console.log(user[0].active);
            if(user[0].active === 1) { //Verificamos si es que no esta active ya
                const newActive = 0;
                const deleted = {
                        ...user[0],
                        active: newActive
                };
                console.log('After spread operator', deleted);
                await pool.query('UPDATE users set ? WHERE id = ?', [deleted, id]);
                res.json({
                    message: 'You delete a user'
                });
            }else {
                console.log("Ya esta false la columna active");
                res.json({
                    message: 'This user is already inactive'
                });
            }
        }else {
            res.status(400).json({
                message: 'The user you want to delete is not in List'
            })
        }
    }else{
        res.status(400).json({
            message: 'Send a number as param'
        })
    }
}


const activeUser = async (req, res) => {
    const {id} = req.params; //Recuperas el id que te llega por params
    const isANumber = /^\d+$/.test(id);//Verificas si realmente lo que te enviaron por param fue un numero
    console.log(isANumber);
    if(isANumber) {
        const allUsersList = await pool.query('SELECT id FROM users');
        if(helper.findCoincidenceInUserList(allUsersList, id)){
            const user = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            console.log(user, 'hola');
            console.log(user[0]);
            console.log(user[0].active);
            if(user[0].active === 0) { //Verificamos si es que no esta active ya
                const newActive = 1;
                const actived = {
                        ...user[0],
                        active: newActive
                };
                console.log('After spread operator', actived);
                await pool.query('UPDATE users set ? WHERE id = ?', [actived, id]);
                res.json({
                    message: 'You active a user'
                });
            }else {
                console.log("Ya esta true la columna active");
                res.json({
                    message: 'This user is already active'
                });
            }
        }else {
            res.status(400).json({
                message: 'The user you want to delete is not in List'
            })
        }
    }else{
        res.status(400).json({
            message: 'Send a number as param'
        })
    }
}

module.exports= {
    addNewUser,
    checkUserProvided,
    showAllUsers,
    deleteUser,
    activeUser
}