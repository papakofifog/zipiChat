const mongoose= require('mongoose')
require('dotenv').config()

const url="mongodb://127.0.0.1:27017/zipiChat";

const connectToZipiDB= async()=>{
    try{
        let dbConnection= await mongoose.connect(url,{});
        if(connectToZipiDB){
            console.log("Connected to the database Successfully")
            return dbConnection;
        }
        
    }catch(err){
        console.error(err)
    }
}

module.exports= connectToZipiDB;