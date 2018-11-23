const _ = require('lodash');
const express = require('express');

const { autenticar } = require('./../middleware/autenticar');
const { comunes } = require('./../comunes/comunes');

const { ObjectID } = require('mongodb');
const { Zona } = require('./../modelos/zona.modelo');

const router = express.Router();

/* 
    MÉTODO: GET 
    RUTA: /zonas 
    DESCRIPCIÓN: Obtiene todas las zonas del sistema
*/
router.get('/', async(req, res) => {
    let respuesta = undefined;
    try {
        let zonas = await Zona.find();
        respuesta = comunes.objetoRespuesta(true, false, "Se han consultado todas las zonas.", zonas);
        res.status(200).send(respuesta);
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error consultando las zonas.", e);
        res.status(400).send(respuesta);
    }
});

/* 
    MÉTODO: GET 
    RUTA: /zonas/:id
    DESCRIPCIÓN: Obtiene una zona por su identificador
*/
router.get('/:id', async(req, res) => {
    let respuesta = undefined;
    try {
        let id = req.params.id;

        if (!ObjectID.isValid(id)) {
            respuesta = comunes.objetoRespuesta(false, false, "El parametro enviado no es válido.")
            return res.status(404).send(respuesta)
        }

        let zona = await Zona.buscarPorId(id);
        respuesta = comunes.objetoRespuesta(true, false, "Se ha consultado la zona.", zona);
        res.status(200).send(respuesta);
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error consultando la zona.", e);
        res.status(400).send(respuesta);
    }
});

/*
    MÉTODO: POST 
    RUTA: /zonas 
    DESCRIPCIÓN: Registra una zona en el sistema
    DICCIONARIO DE PARAMETROS:
        c: Ciudad
*/
router.post('/', autenticar, async(req, res) => {
    let respuesta = undefined;

    try {
        let body = _.pick(req.body, ['c']);
        let objZona = {
            ciudad: body.c
        }
        
        let zona = await Zona.crear(objZona);
        if (zona == null) {
            respuesta = comunes.objetoRespuesta(false, false, "Ha ocurrido un error registrando la zona.");
            return res.status(400).send(respuesta);
        } 

        respuesta = comunes.objetoRespuesta(true, false, "Se ha registrado la zona en el sistema.", zona);
        res.status(200).send(respuesta);
        
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error registrando la zona.", e);
        res.status(400).send(respuesta);
    }
});

/*
    MÉTODO: PATCH 
    RUTA: /zonas/:id
    DESCRIPCIÓN: Actualiza la información de la zona
    DICCIONARIO DE PARAMETROS:
        id: Identificador de la zona
        c: Ciudad
*/
router.patch('/:id', autenticar, async(req, res) => {
    let respuesta = undefined;

    try {
        let id = req.params.id;

        if (!ObjectID.isValid(id)) {
            respuesta = comunes.objetoRespuesta(false, false, "El parametro enviado no es válido.")
            return res.status(404).send(respuesta)
        }

        let body = _.pick(req.body, ['c']);
        let objZona = {
            ciudad: body.c
        }
        
        let zona = await Zona.actualizar(id, objZona);
        if (zona == null) {
            respuesta = comunes.objetoRespuesta(false, false, "Ha ocurrido un error actualizando la zona.");
            return res.status(400).send(respuesta);
        } 

        respuesta = comunes.objetoRespuesta(true, false, "Se ha actualizado la zona en el sistema.", zona);
        res.status(200).send(respuesta);
        
    } catch (e) {
        respuesta = comunes.objetoRespuesta(false, true, "Ha ocurrido un error actualizando la zona.", e);
        res.status(400).send(respuesta);
    }
});

module.exports = router;