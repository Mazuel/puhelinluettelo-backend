require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms :body"));
app.use(cors());
app.use(express.static("build"));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p>
          <p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

//TODO
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined || body.name === "") {
    return response.status(400).json({ error: "name missing" });
  }

  if (body.number === undefined || body.number === "") {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
