const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./mongo');
const { Person } = require('./src/models/persons.js');
const errorHandler = require('./src/middleware/errorHandler.js');
const isValidPhoneNumber = require('./src/utils/validator.js');

const app = express();
app.use(cors());

connectDB();

app.use(express.static('public'));

app.use(express.json());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(morgan('tiny'));

app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`POST request received: ${JSON.stringify(req.body)}`);
  }
  next();
});

// Ruta POST para crear un nuevo registro
app.post('/api/persons', async (request, response, next) => {
  try {
    const { name, number } = request.body;

    if (!name || !number) {
      return response.status(400).json({
        error: 'Missing name or number',
      });
    }

    if (!isValidPhoneNumber(number)) {
      return response.status(400).json({
        error: 'Invalid phone number',
      });
    }

    // Verifica si el nombre ya existe en la agenda
    const existingPerson = await Person.findOne({ name });
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique',
      });
    }

    const person = new Person({ name, number });
    await person.save();

    response.json(person);
  } catch (error) {
    next(error);
  }
});

// Ruta PUT para actualizar todos los campos de un registro existente
app.put('/api/persons/:id', async (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatePerson) => {
      response.json(updatePerson);
    })
    .catch((error) => next(error));
});

// Ruta GET para obtener todos los registros
app.get('/', (request, response) => {
  response.send('<h1>Hallo Welt!</h1>');
});

app.get('/api/persons', async (request, response) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

// Ruta GET ID para obtener un registro por id
app.get('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    const person = await Person.findById(id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).send('Not found');
    }
  } catch (error) {
    next(error);
  }
});

// Ruta DELETE para eliminar un registro
app.delete('/api/persons/:_id', (request, response, next) => {
  console.log('request.params');
  Person.findByIdAndDelete(request.params._id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Ruta GET para obtener la información del servidor
app.get('/info', async (request, response) => {
  try {
    const date = new Date();

    const persons = await Person.countDocuments();
    console.log('persons', persons);
    response.send(`<p>Phonebook has info for ${persons} people</p>
    <p>${date}</p>`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

app.use(unknownEndpoint);

app.use(errorHandler);

// Puerto de la aplicación
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
