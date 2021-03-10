const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crea tareas
// api/tareas
console.log('justo antes del post de tareas');
router.post('/',
    auth, 
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto de la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener las tareas por un proyecto
router.get('/',
    auth, 
    [
        check('proyecto', 'El proyecto de la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.obtenerTareas
);


// Actualizar las tareas por proyecto
router.put('/:id',
    auth, 
    // [
    //     //check('proyecto', 'El proyecto de la tarea es obligatorio').not().isEmpty()
    // ],
    tareaController.actualizarTareas
);

// Eliminar una tarea via ID
router.delete('/:id',
    auth, 
    tareaController.eliminarTarea
);

module.exports = router;