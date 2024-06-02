const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
  },
})

const Person = mongoose.model("Person", PersonSchema);

module.exports = { Person}
