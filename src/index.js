const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');//requiero con el objetivo de poder parsear los datos enviados a traves de JSON
const exphbs = require('express-handlebars');
const path = require('path');
const pkg = require('../package.json');

const app = express();


//Settings
app.set('orderId', 10)
app.set('orderCreated', false);
app.set('userId', 0)
app.set('pkg', pkg);
app.set('port', process.env.PORT || 3050);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({//Le paso un obj para config
    defaultLayout: 'main', //La plantilla principal 
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))

app.set('view engine', '.hbs');

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Global Variables
app.use((req, res, next) => {


    next();
})

app.get('/', (req, res) => {
    res.json({
        name: app.get('pkg').name,
        author: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
})

//Routes
app.use('/user', require('./routes/authentication'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));

//Public
app.use(express.static(path.join(__dirname, 'public')));


//Starting the server
app.listen(app.get('port'), () => {
    console.log("hello world");
    console.log(`Server on port ${app.get('port')}`);
})

