const mongoose = require("mongoose");
require('dotenv').config();
// const mongodbURI = "mongodb://localhost:27017/FSD";
const mongodbURI = "mongodb+srv://gowthamravichandran58:password%40123@tasttracker.do75nlm.mongodb.net/portfolio";

function DBconnection() {

    console.log(process.env.test);
mongoose.connect(mongodbURI).then((response) =>
{

    if(response){

        console.log("DB Connection successfull");
    }
}

).catch((err)=>{

    console.log("DB Connection failed");

}

);
}
module.exports = {

DBconnection

}