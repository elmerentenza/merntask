const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');
const { exists } = require('../models/Proyecto');

exports.crearTarea = async (req, res) => {
    
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extrayendo el id del proyecto de entre los datos del request
    const { proyecto } = req.body;
    


    try {

        // comprobando que el proyecto exista.
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: "Proyecto no encontrado"})
        }

        // Si el proyecto actual pertenece al del usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id){ 
            return res.status(401).json({ msg: 'No Autorizado'});
        }

        // creando la tarea
        const tarea = new Tarea(req.body);

        // guardando la tarea
        tarea.save();

        res.json({ tarea });

        // obteniendo el creador via JWT 


        // guardando el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error INSERTANDO UNA NUEVA TAREA')
    }
}

// obtener las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extrayendo el id del proyecto de entre los datos del request
    //const { proyecto } = req.body;
    const { proyecto } = req.query; // porque se envian como 'params'
    

    try {
        // comprobando que el proyecto exista.
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: "Proyecto no encontrado"})
        }

        // Si el proyecto actual pertenece al del usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id){ 
            return res.status(401).json({ msg: 'No Autorizado'});
        }

        // obtener tareas por poryecto
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error OBTENIENDO LAS TAREAS')
    }
}

// actualizar las tareas por proyecto
exports.actualizarTareas = async (req, res) => {

    // // revisar si hay errores
    // const errores = validationResult(req);
    // if (!errores.isEmpty()) {
    //     return res.status(400).json({ errores: errores.array() })
    // }

    // extrayendo el id del proyecto de entre los datos del request
    const { nombre, estado } = req.body;

    try {

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea){
            return res.status(404).json({ msg: 'No existe esa tarea'});
        }

        // // comprobando que el proyecto exista.
        // const existeProyecto = await Proyecto.findById(proyecto);
        // if (!existeProyecto) {
        //     return res.status(404).json({ msg: "Proyecto no encontrado"})
        // }

        // // Si el proyecto actual pertenece al del usuario autenticado
        // if (existeProyecto.creador.toString() !== req.usuario.id){ 
        //     return res.status(401).json({ msg: 'No Autorizado'});
        // }

        // Crear un objeto con la nueva informacion
        const nuevaTarea = {};
        // if (nombre) nuevaTarea.nombre = nombre;   //este codigo no funciona
        // if (estado) nuevaTarea.estado = estado;   // este codigo no funciona
        
        // Object.keys(req.body).map(campo => {
        //     if (campo === "nombre") nuevaTarea.nombre = nombre;
        //     if (campo === "estado") nuevaTarea.estado = estado;
        // });

        nuevaTarea.nombre = nombre;   //este codigo no funciona
        nuevaTarea.estado = estado;   // este codigo no funciona

        //console.log(nuevaTarea);

        tarea = await Tarea.findOneAndUpdate(
            { _id: req.params.id },
            { $set: nuevaTarea },
            { new: true }
        );
        res.json({ tarea });


        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error ACTUALIZANDO LA TAREAS')        
    }
}

// eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    
    try {
        let { proyecto } = req.query;
        
        // revisar el ID
        //console.log(req.params.id);
        let tarea = await Tarea.findById(req.params.id);

        // si la tarea existe o no
        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada'});
        }
        
        const proyecto_tarea = await Proyecto.findById(proyecto);
        if (!proyecto_tarea) {
            return res.status(404).json({ msg: 'ERROR inusual: Tarea de un proyecto no valido.'});
        }

        // verificar el creador del proyecto
        if (proyecto_tarea.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado a eliminar esa tarea...'});
        }

        // eliminar el proyecto
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error ELIMINAR LA TAREA en el servidor');    
    }    
}