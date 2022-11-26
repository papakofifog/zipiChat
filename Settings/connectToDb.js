const mongoose= require('mongoose')
require('dotenv').config()

const connectToZipiDB=()=>{
    let dbConnection= mongoose.connect(process.env['DB_SECRET'],
    {useNewUrlParser: true,useUnifiedTopology: true});
    return dbConnection;
}

module.exports= connectToZipiDB;