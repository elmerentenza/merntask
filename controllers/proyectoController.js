const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// crear un nuevo proyecto
exports.crearProyecto = async (req, res) => {
    
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        const proyecto = new Proyecto(req.body);

        // obteniendo el creador via JWT 
        proyecto.creador = req.usuario.id;

        // guardando el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error INSERTANDO UN NUEVO PROYECTO')
    }
}

// obteniendo todos los proyectos
exports.obtenerProyectos = async (req, res) => {
    try {
        //console.log(req.usuario);
        const proyectos = await Proyecto.find({ creador: req.usuario.id});
        // se puede agregar a la linea anterior....
        // ............. usuario.id}).sort({ creado: -1})
        // y daria los proyectos ordenados de forma inversa segun la fecha de creado

        res.json({ proyectos });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');

    }
}

// actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }
    
    // extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    // si existe un nombre especificado,
    // aunque creo que esta validacion esta incluida ya en el checkeo
    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el ID
        //console.log(req.params.id);
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado'});
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado'});
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate(
            { _id: req.params.id }, 
            { $set: nuevoProyecto}, 
            { new: true}
        );

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error ACTUALIZANDO PROYECTO en el servidor'); 
    }

}

// eliminar un proyecto
exports.elminarProyecto = async (req, res) => {

    try {
        // revisar el ID
        //console.log(req.params.id);
        let proyecto = await Proyecto.findById(req.params.id);

        console.log(proyecto);

        // si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado'});

        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado'});
        }

        // eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto Eliminado' });




    } catch (error) {
        console.log(error);
        res.status(500).send('Error ACTUALIZANDO PROYECTO en el servidor');    
    }
}