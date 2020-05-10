const express = require('express')
const app = express()
let morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('content', (req, res, param) =>{
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const Person = require('./models/person')

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(total => {
    const text = `<p>Phonebook has info for ${total} people</p>`
    const date = new Date()

    res.send(text.concat(date))
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    response.json(person.toJSON())
  }).catch(error => next(error))
})
  
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  const person = new Person({
    name : body.name,
    number: body.number
  })

  person.save().then(savedPerson =>{
    response.json(savedPerson.toJSON())
  }).catch(e => next(e))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(p => {
    res.json(p)
  }).catch((e) => next(e))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler)

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

