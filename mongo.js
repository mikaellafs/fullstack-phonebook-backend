const arg = process.argv
if (arg.length<3 ) {
    console.log('give password as argument')
    process.exit(1)
}
const mongoose = require('mongoose')

const password = arg[2]

const url =
  `mongodb+srv://mikaellafs:${password}@cluster0-5k8gq.gcp.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(arg.length<5){
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(p)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}

const person = new Person({
  name : arg[3],
  number : arg[4]
})

person.save().then(response => {
  console.log(`${response.name} number ${response.number} to phonebook`)
  mongoose.connection.close()
})