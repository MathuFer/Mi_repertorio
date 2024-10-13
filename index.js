const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/canciones', (req, res) => {
  fs.readFile('./repertorio.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer el archivo' });
    }
    const canciones = JSON.parse(data);
    res.json(canciones);
  });
});

app.post('/canciones', (req, res) => {
  const nuevaCancion = req.body;
  fs.readFile('./repertorio.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer el archivo' });
    }
    const canciones = JSON.parse(data);
    nuevaCancion.id = canciones.length ? canciones[canciones.length - 1].id + 1 : 1;
    canciones.push(nuevaCancion);
    
    fs.writeFile('./repertorio.json', JSON.stringify(canciones), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al guardar la canción' });
      }
      res.status(201).json(canciones);
    });
  });
});

app.put('/canciones/:id', (req, res) => {
  const { id } = req.params;
  const cancionActualizada = req.body;

  fs.readFile('./repertorio.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer el archivo' });
    }
    let canciones = JSON.parse(data);
    const index = canciones.findIndex(c => c.id == id);
    if (index === -1) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }
    canciones[index] = { id: Number(id), ...cancionActualizada };
    
    fs.writeFile('./repertorio.json', JSON.stringify(canciones), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al actualizar la canción' });
      }
      res.json(canciones);
    });
  });
});

app.delete('/canciones/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('./repertorio.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer el archivo' });
    }
    let canciones = JSON.parse(data);
    const index = canciones.findIndex(c => c.id == id);
    if (index === -1) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }
    canciones.splice(index, 1);
    
    fs.writeFile('./repertorio.json', JSON.stringify(canciones), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al eliminar la canción' });
      }
      res.json(canciones);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
