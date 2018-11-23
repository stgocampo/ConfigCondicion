const _ = require('lodash');
const express = require('express');
const ifaces = require('os').networkInterfaces();

const { autenticar } = require('./../middleware/autenticar');
const { comunes } = require('./../comunes/comunes');
const { Usuario } = require('./../modelos/usuario.modelo');

const router = express.Router();

/* 
    MÉTODO: GET 
    RUTA: /usuarios 
    DESCRIPCIÓN: Obtiene todos los usuarios del sistema
*/
router.get('/', autenticar, async(req, res) => {
    let respuesta = undefined;
    try {
        let usuarios = await Usuario.find();
        respuesta = comunes.objetoRespuesta(true, false, "Se han consultado todos los usuarios.", usuarios);
        res.status(200).send(respuesta);
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error consultando los usuarios.", e);
        res.status(400).send(respuesta);
    }
});

/* 
    MÉTODO: GET 
    RUTA: /usuarios/me 
    DESCRIPCIÓN: Obtiene la información del usuario que esta ha iniciado sesión
*/
router.get('/me', autenticar, (req, res) => {
    let respuesta = undefined;
    try {
        respuesta = comunes.objetoRespuesta(true, false, "Se ha obtenido la información del usuario que inició sesión en el sistema.", req.user);
        res.status(200).send(respuesta);
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error consultando la información del usuario.", e);
        res.status(400).send(respuesta);
    }
});

/*
    MÉTODO: POST 
    RUTA: /usuarios 
    DESCRIPCIÓN: Registra un usuario en el sistema
    DICCIONARIO DE PARAMETROS:
        nu: Nombre de usuario
        p: Password
*/
router.post('/', async(req, res) => {
    let respuesta = undefined;

    try {
        let body = _.pick(req.body, ['nu', 'p']);
        let objUsuario = {
            nombreUsuario: body.nu,
            password: body.p
        }
        
        let usuario = await Usuario.crear(objUsuario);
        if (usuario == null) {
            respuesta = comunes.objetoRespuesta(false, false, "Ha ocurrido un error registrando el usuario.");
            return res.status(400).send(respuesta);
        } 

        respuesta = comunes.objetoRespuesta(true, false, "Se ha registrado un usuario en el sistema.", usuario);
        res.status(200).send(respuesta);
        
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error registrando el usuario.", e);
        res.status(400).send(respuesta);
    }
});

/*
    MÉTODO: POST 
    RUTA: /usuarios/login
    DESCRIPCIÓN: Autentica un usuario en el sistema
    DICCIONARIO DE PARAMETROS:
        e: Email o correo electrónico
        p: Password
*/
router.post('/login', async(req, res) => {
    let respuesta = undefined;

    try {
        let address = "";
        Object.keys(ifaces).forEach(dev => {
            ifaces[dev].filter(details => {
                if (details.family === 'IPv4' && details.internal === false) {
                    address = details.address;
                }
            });
        });

        const body = _.pick(req.body, ['nu', 'p']);

        // Validaciones
        const usuario = await Usuario.buscarPorCredenciales(body.nu, body.p);
        if (usuario === null) {
            respuesta = comunes.objetoRespuesta(false, false, "No se ha encontrado un usuario con los datos proporcionados.", );
            return res.status(404).send(respuesta);
        }

        console.log("Voy aca 1");
        console.log("Addrress: ", address)

        const token = await usuario.generarTokenAutorizacion(address)
        if (token === null) {
            respuesta = comunes.objetoRespuesta(false, false, "No se ha generado el token de autenticación del usuario.", );
            return res.status(404).send(respuesta);
        }

        console.log("Voy aca 2");

        respuesta = comunes.objetoRespuesta(true, false, "El usuario ha iniciado sesión exitosamente.");
        res.header('x-auth', token).send(respuesta);
    } catch (e) {
        console.log(JSON.stringify(e));
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error iniciando la sesión del usuario.", e);
        res.status(400).send(respuesta);
    }
});

/* 
    MÉTODO: DELETE 
    RUTA: /usuarios/me/token 
    DESCRIPCIÓN: Elimina el token del usuario.
*/
router.delete('/me/token', autenticar, async(req, res) => {
    let respuesta = undefined;
    try {
        await Usuario.removerToken(req.token);
        respuesta = comunes.objetoRespuesta(true, false, "Se ha cerrado la sesión del usuario.")
        res.status(200).send(respuesta);
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error cerrando la sesión del usuario.", e);
        res.status(400).send(respuesta);
    }
})

module.exports = router;