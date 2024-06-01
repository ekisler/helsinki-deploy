const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const url = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Conectado Correctamente a la Base de Datos MongoDB ✔");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

module.exports = {
  Person,
  connectDB,
};