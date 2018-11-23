require('./config/config');

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const { mongoose } = require('./db/mongoose'); // Inicializa la base de datos

// Importación de rutas
const rutasServidores = require('./rutas/servidor.ruta');
const rutasUsuarios = require('./rutas/usuario.ruta');
const rutasZonas = require('./rutas/zona.ruta');

const app = express();
const port = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

// Uso de las rutas
app.use('/servidores', rutasServidores);
app.use('/usuarios', rutasUsuarios);
app.use('/zonas', rutasZonas);


app.use(function(req, res, next) {s
    return res.render('index');
});

app.listen(port, () => {
    if (process.send) process.send('online');
    console.log(`Servidor iniciado en el puerto ${ port }`);
});

module.exports = { app };