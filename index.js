const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
//const PORT = 3001;
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Leer usuarios desde el archivo
const leerUsuarios = () => {
  const data = fs.readFileSync('./usuarios.json');
  return JSON.parse(data);
};

// Ruta GET para obtener usuarios
app.get('/api/usuarios', (req, res) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
});

// Ruta POST para agregar usuario
app.post('/api/usuarios', (req, res) => {
  const usuarios = leerUsuarios();
  const nuevoUsuario = req.body;
  usuarios.push(nuevoUsuario);
  fs.writeFileSync('./usuarios.json', JSON.stringify(usuarios, null, 2));
  res.status(201).json( nuevoUsuario );
});

// Ruta PUT para actualizar un usuario existente por ID
app.put('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const nuevosDatos = req.body;

  let usuarios = leerUsuarios();
  const indice = usuarios.findIndex(usuario => usuario.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  usuarios[indice] = { ...usuarios[indice], ...nuevosDatos };

  fs.writeFileSync('./usuarios.json', JSON.stringify(usuarios, null, 2));
  res.json(usuarios[indice]);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
