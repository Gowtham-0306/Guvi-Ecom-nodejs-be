const mongoose = require("mongoose");


const userRegistrationSchema = mongoose.Schema({


Username : {type : String  , required : true  , unique : false} ,
password : {type : String , required : true},
email : { type : String , required : true , unique : false} ,
phonenumber : {type : Number , default : 0},
areyouadmin :{type : Boolean , default : false },
usercart : {type : Array , default : [1,2] }


    
},
{timestamps : true}
);


const productdetailschema = mongoose.Schema({


    productname : {type : String  , required : true  } ,
    productdescription : {type : String , required : true},
    productprice: {type : Number , required : true ,  default: 0 },
    productrating :{ type : Number , required : false , default : 0 } ,
    imageurl :{ type : String , required : false , default : "" } ,
    
     
        
    },
    {timestamps : true}
    );



 
    const cartdetailschema = mongoose.Schema({


        productname : {type : Array  , required : true  } ,
     
        
         
             
        },
        {timestamps : true}
        );





const UserRegistrationModel = mongoose.model("userregistrations" , userRegistrationSchema);
const productdetailsmodel = mongoose.model("productdetails" , productdetailschema);
const cartdetailsmodel = mongoose.model("cartdetails" , cartdetailschema);


module.exports = { UserRegistrationModel ,
    productdetailsmodel , cartdetailsmodel
};