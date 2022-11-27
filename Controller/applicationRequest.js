const showHomePage = (req, res, next) =>{
    try{
        res.status(200).send("Welcome")
    }catch(err){
        next(err)
    }
}

module.exports = showHomePage;