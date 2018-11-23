const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');

const UsuariosSchema = new mongoose.Schema({
    // Nombre real del usuario en el sistema
    nombreUsuario: {
        required: true,
        type: String,
    },

    // Clave actual del usuario encriptada
    password: {
        minlength: 6,
        required: true,
        trim: true,
        type: String
    },

    // Todos los procesos de inicio de sesión que ha realizado el usuario en el sistema
    // Se almacenará la plataforma desde donde se inicio de sesión, así como la ip, fecha y token
    procesosInicioSesion: [{
        token: {
            required: true,
            type: String
        },
        fechaInicio: {
            required: true,
            type: Number
        },
        fechaSalida: {
            required: false,
            type: Number
        },
        ip: {
            required: true,
            trim: true,
            type: String
        }
    }],

    // Tokens de autenticación activos para el usuario.
    tokens: [{
        access: {
            required: true,
            type: String
        },
        token: {
            required: true,
            type: String
        }
    }]
});

UsuariosSchema.methods.generarTokenAutorizacion = async function(ip) {
    let usuario = this;
    let access = 'auth';
    let token = jwt.sign({ _id: usuario._id.toHexString(), access }, process.env.JWT_SECRET).toString();

    usuario.tokens.push({ access, token });
    usuario.procesosInicioSesion.push({ token, fechaInicio: moment().unix(), ip });

    await usuario.save()
    return token;
}
UsuariosSchema.statics.buscarPorCredenciales = async function(nombreUsuario, password) {
    const usuario = await this.buscarPorNombreUsuario(nombreUsuario);
    let respuesta = null

    if (!usuario) return respuesta;

    let res = await bcrypt.compare(password, usuario.password);
    if (res)
        respuesta = usuario;

    return respuesta;
}
UsuariosSchema.statics.buscarPorNombreUsuario = async function(nombreUsuario) {
    return this.findOne({ nombreUsuario });
}
UsuariosSchema.statics.buscarPorToken = function(token) {
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return this.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }, { nombreUsuario: 1 });
}
UsuariosSchema.statics.buscarPorIdYActualizar = async function(_id, body) {
    return this.findOneAndUpdate({ _id }, { $set: body }, { new: true });
}
UsuariosSchema.statics.buscarPorIdYEliminar = function(_id) {
    return Usuario.findOneAndRemove({ _id });
}
UsuariosSchema.statics.crear = function(body) {
    let usuario = new Usuario(body);
    let doc = usuario.save();
    return doc;
}
UsuariosSchema.statics.removerToken = function(token) {
    return Usuario.findOneAndUpdate({ "tokens.token": token }, {
        $set: {
            "procesosInicioSesion.$.fechaSalida": moment().unix()
        },
        $pull: {
            tokens: { token }
        }
    });
}

UsuariosSchema.pre('save', async function(next) {
    let usuario = this;

    // Verificar si el password fue modificado para saber si se ejecuta el middleware
    if (usuario.isModified('password')) {
        let claveEncriptada = await generarClave(usuario.password);
        if (claveEncriptada === null) {
            reject();
            return;
        }

        usuario.password = claveEncriptada;
        next();

    } else {
        next();
    }
});

const Usuario = mongoose.model('Usuario', UsuariosSchema);
const generarClave = async function(claveSinEncriptar) {
    let claveEncriptada = null;

    try {
        let salt = await bcrypt.genSalt(10);
        let claveEncriptada = await bcrypt.hash(claveSinEncriptar, salt);

        return claveEncriptada;
    } catch (e) {
        claveEncriptada = null;
        return claveEncriptada;
    }

}

module.exports = { Usuario }