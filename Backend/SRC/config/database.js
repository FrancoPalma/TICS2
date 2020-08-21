/*module.exports = {
  'url': 'mongodb://localhost/cadis'
}*/

  const mongoose = require('mongoose')

  const URI = "mongodb+srv://dbUser:dbUser@cluster0-kn2ik.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";

  const connectDB = async() => {
    await mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('BASE DE DATOS CONECTADA');
  };

  module.exports = connectDB;
