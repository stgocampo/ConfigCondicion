const comunes = {
    isNullEmptyOrUndefined: function(variable) {
        let retorno = false;
        if (typeof variable === 'undefined' || variable === null || variable == String())
            retorno = true;

        return retorno;
    },

    isNullOrUndefined: function(variable) {
        let retorno = false;
        if (typeof variable === 'undefined' || variable === null)
            retorno = true;

        return retorno;
    },
    

    /*
      MÉTODO: objetoRespuesta
      DESCRIPCIÓN: Retorna un objeto estandarizado para todos los eventos de
      respuesta que serán enviados al usuario final.
    */
    objetoRespuesta: function(completada, error, mensaje, objeto, status) {
        if (typeof completada === 'undefined') completada = true;
        if (typeof error === 'undefined') error = false;
        if (typeof mensaje === 'undefined') mensaje = String();
        if (typeof objeto === 'undefined') objeto = {};
        if (typeof status === 'undefined') status = 200

        return {
            completada,
            error,
            mensaje,
            objeto,
            status
        };
    },

    /*
      MÉTODO: validarFecha
      DESCRIPCIÓN: Valida que todos los parámetros necesarios para armar la fecha
      existan
    */
    validarFecha: function(anio, mes, dia, horas, minutos, segundos) {
        let retorno = true;

        if (this.isNullOrUndefined(anio) || this.isNullOrUndefined(mes) ||
            this.isNullOrUndefined(dia) || this.isNullOrUndefined(horas) ||
            this.isNullOrUndefined(minutos) || this.isNullOrUndefined(segundos))
            retorno = false;

        return retorno;
    }
}

module.exports = { comunes };