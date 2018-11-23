const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const ServidoresSchema = new mongoose.Schema({
    // Identificador de la zona donde estará el servidor
    _idZona: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
    },

    // Ip del servidor
    ip: {
        required: true,
        trim: true,
        type: String,
    },

    // Nombre del servidor
    nombre: {
        required: true,
        trim: true,
        type: String
    },
    
    // Puerto del servidor
    puerto: {
        required: true,
        trim: true,
        type: String,
    }, 
    
    // Orden del servidor en la zona
    orden: {
        required: true,
        type: Number
    }
});

ServidoresSchema.statics.actualizar = function( _id, body ) {
    return this.findOneAndUpdate({ _id },  { $set: body }, { new: true });
}
ServidoresSchema.statics.buscarTodos = function() {
    return this.aggregate([
        {
            $lookup: {
                from: 'zonas',
                localField: '_idZona',
                foreignField: '_id',
                as: 'zona'
            }
        },
        {
            $unwind: "$zona"
        },
        {
            $sort: {
                "zona.ciudad": 1,
                orden: 1,
                _id: 1
            }
        },
        {
            $project: {
                _id: 1,
                ip: 1,
                nombre: 1,
                puerto: 1,
                orden: 1,
                "zona.ciudad": 1
            }
        }
    ])
}
ServidoresSchema.statics.buscarPorIdZona = function(_idz) {
    let _idZona = new ObjectID(_idz);
    
    return this.aggregate([
        {
            $match: {
                _idZona
            }
        },
        {
            $lookup: {
                from: 'zonas',
                localField: '_idZona',
                foreignField: '_id',
                as: 'zona'
            }
        },
        {
            $unwind: "$zona"
        },
        {
            $sort: {
                orden: 1,
                _id: 1
            }
        },
        {
            $project: {
                _id: 1,
                ip: 1,
                nombre: 1,
                puerto: 1,
                orden: 1,
                "zona.ciudad": 1
            }
        }
    ])
}
ServidoresSchema.statics.buscarPorId = function(_id) {
    return this.findOne({ _id });
}
ServidoresSchema.statics.buscarUltimoservidor = async function() {
    return await this.findOne().sort({ orden: -1 });
}
ServidoresSchema.statics.crear = async function(body) {
    let orden = 1;
    let ultimoServidor = await this.buscarUltimoservidor();
    if (ultimoServidor != null) orden = ultimoServidor.orden + 1;

    body.orden = orden;
    let servidor = new Servidor(body);
    let doc = await servidor.save();
    return doc;
}



const Servidor = mongoose.model('Servidor', ServidoresSchema);
module.exports = { Servidor }