const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Persona = require('../models/persona');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async( req = request, res = response ) => {

    const { correo, password } = req.body;

    try {
        
        //Verificar si el correo existe
        const persona = await Persona.findOne( { correo } );

        if ( !persona ) {
            return res.status(404).json({
                msg: 'Correo de persona no existe en la base de datos 404'
            });
        }
    
        //Si el persona esta activo (persona.estado === false)
        if ( persona.estado === false ) {
            return res.status(400).json({
                msg: 'La cuenta del persona esta inactivo'
            });
        }
    
        //Verificar la password el persona    //comporeSync, encripta ambas passwords y las compara
        const validarPassword = bcryptjs.compareSync( password, persona.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'La password es incorrecta'
            });
        }
        
        //Generar JWT
        const token = await generarJWT( persona.id );
    
        res.json({
            msg: 'Login Auth Funciona!',
            correo, password,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el admin'
        })
    }


}


module.exports = {
    login
}