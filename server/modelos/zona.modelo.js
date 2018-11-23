const mongoose = require('mongoose');

const ZonasSchema = new mongoose.Schema({
    // Nombre de la zona
    ciudad: {
        required: true,
        type: String,
    }
});

ZonasSchema.statics.actualizar = function( _id, body ) {
    return this.findOneAndUpdate({ _id },  { $set: body }, { new: true });
}

ZonasSchema.statics.buscarPorId = function(_id) {
    return this.findOne({ _id });
}

ZonasSchema.statics.crear = function(body) {
    let zona = new Zona(body);
    let doc = zona.save();
    return doc;
}



const Zona = mongoose.model('Zona', ZonasSchema);
module.exports = { Zona }