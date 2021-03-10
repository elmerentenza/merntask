const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        //console.log("ERROR hubo errores de validatonresult", errores);
        return res.status(401).json({ errores: errores.array() })
    }

    const { email, password } = req.body;

    // siempre los accesos a la bd deben hacerse
    // en un bloque try-catch para visualizar los errores
    try {
        // Revisar que el usaurio registrado sea unico
        let usuario = await Usuario.findOne({ email });
        if (usuario){
            //console.log("ERROR El usuario ya existe...");
            return res.status(402).json({ msg: 'El usuario ya existe'});
        }

        //crea el nuevo usuario
        usuario = new Usuario(req.body);

        // hashear el password
        const salt = await bcryptjs.genSalt(5);
        usuario.password = await bcryptjs.hash(password, salt);

        // guarar el usuario
        await usuario.save();

        /// ################################################
        /// ##########  PREPARANDO LA RESPUESTA  ###########
        /// ################################################
        // crear y firmar el JWT
        const payload = {
            usuario : {
                id: usuario.id
            }

        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            // Mensaje de confirmacion
            res.json({ token: token });

        });
        /// ################################################
        /// ################################################

    } catch (error) {
        console.log(error);
        res.status(403).json({ msg: 'Hubo un error en la creacion del usuario.'});
    }
}

