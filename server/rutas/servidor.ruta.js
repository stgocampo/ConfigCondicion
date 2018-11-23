const _ = require('lodash');
const express = require('express');

const { autenticar } = require('./../middleware/autenticar');
const { comunes } = require('./../comunes/comunes');

const { ObjectID } = require('mongodb');
const { Servidor } = require('./../modelos/servidor.modelo');

const router = express.Router();

/* 
    MÉTODO: GET 
    RUTA: /servidor 
    DESCRIPCIÓN: Obtiene todos los servidores
*/
router.get('/', async(req, res) => {
    let respuesta = undefined;
    try {
        let servidores = await Servidor.buscarTodos();
        respuesta = comunes.objetoRespuesta(true, false, "Se han consultado todos los servidores.", servidores);
        res.status(200).send(respuesta);
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error consultando los Servidores.", e);
        res.status(400).send(respuesta);
    }
});

/* 
    MÉTODO: GET 
    RUTA: /servidor/:id
    DESCRIPCIÓN: Obtiene un servidor por su identificador
*/
router.get('/:id', async(req, res) => {
    let respuesta = undefined;
    try {
        let id = req.params.id;

        if (!ObjectID.isValid(id)) {
            respuesta = comunes.objetoRespuesta(false, false, "El parametro enviado no es válido.")
            return res.status(404).send(respuesta)
        }

        let servidor = await Servidor.buscarPorId(id);
        respuesta = comunes.objetoRespuesta(true, false, "Se ha consultado el servidor.", servidor);
        res.status(200).send(respuesta);
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error consultando el servidor.", e);
        res.status(400).send(respuesta);
    }
});

/* 
    MÉTODO: GET 
    RUTA: /servidor/:id
    DESCRIPCIÓN: Obtiene la lista de servidores de una zona ordenada
*/
router.get('/XIdZona/:id', async(req, res) => {
    let respuesta = undefined;
    try {
        let id = req.params.id;

        if (!ObjectID.isValid(id)) {
            respuesta = comunes.objetoRespuesta(false, false, "El parametro enviado no es válido.")
            return res.status(404).send(respuesta)
        }

        let servidor = await Servidor.buscarPorIdZona(id);
        respuesta = comunes.objetoRespuesta(true, false, "Se ha consultado el servidor.", servidor);
        res.status(200).send(respuesta);
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error consultando el servidor.", e);
        res.status(400).send(respuesta);
    }
});

/*
    MÉTODO: POST 
    RUTA: /servidores 
    DESCRIPCIÓN: Registra un servidor en el sistema
    DICCIONARIO DE PARAMETROS:
        _iz: Id de la zona del servidor
        i: Ip del servidor
        p: Puerto del servidor
*/
router.post('/', autenticar, async(req, res) => {
    try {
        let body = _.pick(req.body, ['_iz', 'i', 'n', 'p']);
        let objServidor = {
            _idZona: body._iz,
            ip: body.i,
            nombre: body.n,
            puerto: body.p
        }
        
        let servidor = await Servidor.crear(objServidor);
        if (servidor == null) {
            respuesta = comunes.objetoRespuesta(false, false, "Ha ocurrido un error registrando el servidor.");
            return res.status(400).send(respuesta);
        } 

        respuesta = comunes.objetoRespuesta(true, false, "Se ha registrado el servidor en el sistema.", servidor);
        res.status(200).send(respuesta);
        
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error registrando el servidor.", e);
        res.status(400).send(respuesta);
    }
});

/*
    MÉTODO: PATCH 
    RUTA: /servidores/:id
    DESCRIPCIÓN: Actualiza la información del servidor
    DICCIONARIO DE PARAMETROS:
        id: Identificador del servidor
        _iz: Identificador de la zona
        i: Ip del servidor
        p: puerto del servidor
*/
router.patch('/:id', autenticar, async(req, res) => {
    let respuesta = undefined;

    try {
        let id = req.params.id;

        if (!ObjectID.isValid(id)) {
            respuesta = comunes.objetoRespuesta(false, false, "El parametro enviado no es válido.")
            return res.status(404).send(respuesta)
        }

        let body = _.pick(req.body, ['_iz', 'i', 'n', 'o', 'p']);
        let objServidor = { };

        if (!comunes.isNullEmptyOrUndefined(body.iz))
            objServidor._idZona = body._iz;

        if (!comunes.isNullEmptyOrUndefined(body.i))
            objServidor.ip = body.i;

        if (!comunes.isNullEmptyOrUndefined(body.n))
            objServidor.nombre = body.n;

        if (!comunes.isNullEmptyOrUndefined(body.p))
            objServidor.puerto = body.p

        if (!comunes.isNullEmptyOrUndefined(body.o))
            objServidor.orden = body.o

        let servidor = await Servidor.actualizar(id, objServidor);
        if (servidor == null) {
            respuesta = comunes.objetoRespuesta(false, false, "Ha ocurrido un error actualizando el servidor.");
            return res.status(400).send(respuesta);
        } 

        respuesta = comunes.objetoRespuesta(true, false, "Se ha actualizado el servidor en el sistema.", servidor);
        res.status(200).send(respuesta);
        
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error actualizando el servidor.", e);
        res.status(400).send(respuesta);
    }
});

module.exports = router;