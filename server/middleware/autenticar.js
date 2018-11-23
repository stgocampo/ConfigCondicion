const { comunes } = require('./../comunes/comunes');
const { Usuario } = require('./../modelos/usuario.modelo');

const autenticar = async(req, res, next) => {
    let respuestaError = null;

    try {
        let token = req.header('x-auth');
        let usuario = await Usuario.buscarPorToken(token);

        if (!usuario) {
            respuestaError = comunes.objetoRespuesta(false, false, 'No se ha encontrado el usuario')
            return res.status(401).send(respuestaError);
        }
        
        req.user = usuario;
        req.token = token;

        next();

    } catch (e) {
        respuestaError = comunes.objetoRespuesta(false, false, 'Ha ocurrido un error autenticando la petición del usuario', e)
        res.status(400).send(respuestaError);
    }
}

module.exports = { autenticar }