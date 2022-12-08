const mongoose= require('mongoose')
require('dotenv').config()

const connectToZipiDB= async()=>{
    try{
        let dbConnection= await mongoose.connect(process.env['DB_SECRET'],
        {useNewUrlParser: true,useUnifiedTopology: true},()=>{
            console.log("Connected to the database Successfully")
        });
        return dbConnection;
    }catch(err){
        next(err)
    }
    
}

module.exports= connectToZipiDB;