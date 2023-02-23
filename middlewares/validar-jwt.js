const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Persona = require('../models/persona');

const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');
    
    //Validar si el token se envia en los headers
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );

        //leer la persona que corresponda el uid
        const persona = await Persona.findById( uid );

        //Verificar el uid de la persona, si no existiera
        if ( !persona ) {
            return res.status(401).json({
                msg: 'Token no válido - Persona no existe en la base de datos'
            });
        }

        //Verificar si el uid esta en estado: true
        if ( !persona.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - Persona inactivo : Estado FALSE'
            });
        }

        req.persona = persona;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}


module.exports = {
    validarJWT
}