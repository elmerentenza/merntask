const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();

// conectar a la base de datos
conectarDB();

// habilitar cors
app.use(cors());

// habilitar el express.json
app.use(express.json({ extended: true }));

// puerto del servidor
const port = process.env.port || 5000; 

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// notas> req viene de REQUEST y res viene de RESPONSE
// definir la pagina principal
app.get('/', (req, res) => {
    res.send('Backend del proyecto MERN');
})

// arrancar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})
