// var express = require("express")
// var bodyParser = require("body-parser")
// var mongoose = require("mongoose")

// const app = express()

// app.use(bodyParser.json())
// app.use(express.static('public'))
// app.use(bodyParser.urlencoded({
//     extended:true
// }))

// mongoose.connect('mongodb://localhost:27017/signup',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// var db = mongoose.connection;

// db.on('error',()=>console.log("Error in Connecting to Database"));
// db.once('open',()=>console.log("Connected to Database"))

// app.post("/signup",(req,res)=>{
//     var fname = req.body.fname;
//     var lname = req.body.lname;
//     var cname = req.body.cname
//     var profile = req.body.profile
//     var male = req.body.male
//     var female = req.body.female
//     var other = req.body.other
//     var email = req.body.email;
//     var number = req.body.number

//     var data = {
//         "fname": fname,
//         "lname": lname,
//         "Cname": cname,
//         "profile": profile,
//         "male": male,
//         "female": female,
//         "other": other,
//         "email" : email,
//         "number": number,
//     }

//     db.collection('new_users').insertOne(data,(err,collection)=>{
//         if(err){
//             throw err;
//         }
//         console.log("Record Inserted Successfully");
//     });
//     return res.redirect('signup.html')
// })


// app.get("/",function(req,res) {
//     res.sendFile(__dirname + "/index.html");
// });

// app.listen (3000,function() {
//   console.log("Server is running on localhost 3000");
// });
    
// console.log("Listening on PORT 3000");