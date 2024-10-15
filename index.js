const {
  createServer
} = require("node:http");
const {
  UserRegistrationModel,
  productdetailsmodel,
  cartdetailsmodel
} = require("./model/taskmodel")
const express = require("express")
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bodyparser = require("body-parser");
const razorpay = require('razorpay');
const cors = require("cors")
const {
  DBconnection
} = require("./dbconfig");
const {
  log
} = require("node:console");
const Razorpay = require("razorpay");
const httpserver = express();
// DBconnection();
httpserver.use(bodyparser.json());
httpserver.use(cors());
httpserver.use(express.urlencoded({extended : false}));

DBconnection();
//  httpserver.use("/" , require("./controllers/taskcontroller"))

var users = [];
httpserver.post("/login", async (req, res) => {

  const {
    Username,
    password
  } = req.body;
  const isselectedamin = req.body.areyouadmin;


  const filteredUser = await UserRegistrationModel.findOne({
    Username: req.body.Username,
    password: req.body.password,
    areyouadmin: req.body.areyouadmin
  });
  // const filteredadminUser = await UserRegistrationModel.findOne({ Username: req.body.Username, password: req.body.password , areyouadmin : req.body.areyouadmin });
  console.log(filteredUser);
  try {
    if (filteredUser) {


      console.log("valid creds");
      const token = jwt.sign({
        userId: filteredUser._id
      }, 'your_secret_key', {
        expiresIn: '1h'
      }); // sending token to the user if his creds is correct 

      res.status(200).json({
        message: "valid user",
        userdetails: filteredUser,
        token
      });


    } else {

      res.status(400).json({
        message: "invalid user"
      })
    }
  } catch (err) {
    //  res.status(400).json({message : "internal server error"})

  }


});

/// post method for cart
httpserver.post("/addcart", (req, res) => {

  const newcartdetails = new cartdetailsmodel(req.body);
  console.log(req.body);
  console.log(`niew`);
  console.log(newcartdetails);
  try {

    if (newcartdetails) {
      newcartdetails.save();

      res.send({
        message: "cart details saved !!!"
      })

    } else {

      res.status(500).json({
        message: " creation failed"
      })



    }

  } catch (err) {
    console.log(`${err} error logged here`);


  }



});




///post method for userregistration


httpserver.post("/createuser", (req, res) => {

  const newUserdetails = new UserRegistrationModel(req.body);

  try {

    if (newUserdetails) {
      newUserdetails.save();

      res.send({
        message: "user created"
      })

    } else {

      res.status(500).json({
        message: "user creation failed"
      })



    }

  } catch (err) {
    console.log(`${err} error logged here`);


  }



});





///



httpserver.post("/createproduct", (req, res) => {

  const newproductdetails = new productdetailsmodel(req.body);
  console.log(req.body);
  console.log(`niew`);
  console.log(newproductdetails);
  try {

    if (newproductdetails) {
      newproductdetails.save();
      console.log(`sav`);
      res.status(200).json({
        message: "product created !!!"
      })

    } else {

      res.status(500).json({
        message: "product creation failed"
      })



    }

  } catch (err) {
    console.log(`${err} error logged here`);


  }



});





httpserver.post("/createtaskdetails", (req, res) => {

  const newtaskdetails = new taskdetailsmodel(req.body);

  try {

    if (newtaskdetails) {
      newtaskdetails.save();

      res.send({
        message: "tasks details saved",
        userdata: newtaskdetails
      })

    } else {

      res.status(400).json({
        message: "tasks details not saved , something went wrong"
      })



    }

  } catch (err) {
    console.log(`${err} error logged here`);


  }



});








///

//get task detail from taskdetails document
httpserver.get("/getproductdetails", (req, res, next) => {
  productdetailsmodel.find().then((response) => {

    if (response) {

      if (response.length > 0) {

        res.status(200).json({
          "productdetails": response
        })
      } else {
        res.status(200).json({
          "response": " tasks not found"
        })
      }



    }
  }).catch((err) => {
    {

      res.status(500).json({
        "message": "internal server error"
      })

    }
  })




});

//get user regdetai;s

httpserver.get("/getuserregistrationdetails:username", (req, res, next) => {

  var username = req.params.username;
  UserRegistrationModel.find().then((response) => {

    if (response) {

      if (response.length > 0) {

        res.status(200).json({
          "userregistrationdetails": response
        })
      } else {
        res.status(200).json({
          "response": " userregistrationdetails not found"
        })
      }



    }
  }).catch((err) => {
    {

      res.status(500).json({
        "message": "internal server error"
      })

    }
  })




});






///to update usercart

httpserver.post("/login:userid", async (req, res) => {

  const {
    Username,
    password
  } = req.body;
  const userId = req.params.userId;



  // if(isselectedamin){
  //   const filteredadminUser = await UserRegistrationModel.findOne({ Username: req.body.Username, password: req.body.password , areyouadmin : req.body.areyouadmin });
  //   console.log(filteredadminUser);
  // res.json({isvalidadminuser : true});

  // }

  const filteredUser = await UserRegistrationModel.findOne({
    _id: req.body.userId
  });
  const filteredusercart = filteredUser.usercart;
  // const filteredadminUser = await UserRegistrationModel.findOne({ Username: req.body.Username, password: req.body.password , areyouadmin : req.body.areyouadmin });
  console.log(filteredUser);
  try {
    if (filteredUser) {


      console.log("valid creds");


      res.status(200).json({
        message: "valid user",
        usercartdetails: filteredusercart
      });


    } else {

      res.status(400).json({
        message: "invalid user"
      })
    }
  } catch (err) {
    //  res.status(400).json({message : "internal server error"})

  }


});




//razorpay1


httpserver.post('/order', async (req, res) => {
 
const razorpay = new Razorpay({

key_id : process.env.RAZORPAY_KEY_ID,
key_secret : process.env.RAZORPAY_SECRET


});

const options = req.body;
const order = await razorpay.orders.create(options);

if(order){

  res.json(order);



}
else{

  return res.status(500).send("Error");
}




});
























// starts a simple http server locally on port 3000
 httpserver.listen(process.env.PORT, process.env.HOSTNAME, () => {
   console.log('Listening on 127.0.0.1:3000');
 });



// run with `node server.mjs`
