var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var {ObjectId} = require("mongodb");
const bcrypt = require('bcrypt');
const session = require('express-session');


const app = express()
app.use(express.static(__dirname+'/static'));
const path = require('path');
const { stringify } = require("querystring");
const { pid } = require("process");

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(session({
    secret: 'mmcoeit2024wad',
    resave: false,
    saveUninitialized: true
  }));
  
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
});

// const User_Data = mongoose.model('User_Data', UserSchema);


mongoose.connect('mongodb://localhost:27017/signup',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))


app.get('/', (req, res) => {
    res.render('login.ejs');

  });

app.post("/register",(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;

    // Hash the password with bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        throw err;
      }

      var data = {
        "username":username,
        "password": hash,
      }

      // Insert the user data into the database
      db.collection('User_Data').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted successfully");
      });

      // Serve the login page
      return res.redirect('/')
    });
});

  
app.get('/register', (req, res) => {
res.render('register.ejs');
});


app.post('/login',(req,res) => {
    
    var username = req.body.username ;
    var password = req.body.password ;
    
    db.collection('User_Data').findOne({username: username}, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(401).send("Invalid Username or Password");
        }
        console.log(password,"password from user");
        bcrypt.compare(password, user.password, (err, result) => {
            console.log(user.password)
            if (err) {
                throw err;
            }
            if (result === true) {
                return res.redirect('home');
            } else {
                return res.status(401).send("Invalid username or password");
            }
        });
    });
});

app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect("/");
});
const appointDataSchema = new mongoose.Schema({
    First_Name: String,
    Last_Name: String,
    Contact_No: Number,
    DayDate: String,
    Age: Number,
    Gender: String
    // ...
  });
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  
const Appointdata = mongoose.model('appointment_data', appointDataSchema,"appointment_data");

app.get('/home', (req, res) => {
    Appointdata.find({}).then((data) => {
    
        res.render('home', { AppointData: data });
   });
});

const patientDataSchema = new mongoose.Schema({
    First_Name: String,
    Last_Name: String,
    Contact_No: Number,
    Email_ID: String,
    Age: Number,
    Gender: String
    // ...
  });


  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  
const Patientdata = mongoose.model('patient_data', patientDataSchema,"patient_data");

app.get('/PatientList', (req, res) => {
    
   Patientdata.find({}).then((data) => {
    
        res.render('PatientList', { PatientData: data });
    
   });
});

app.get('/Schedule', (req, res) => {
    
    Patientdata.find({}).then((data) => {
     
         res.render('PatientList', { PatientData: data });
     
    });
 });

app.post('/PatientList', (req, res) => {
    res.render('PatientList.ejs');
});


app.post('/Add_Patient',(req, res) => {

    var fname = req.body.fname;
    var lname = req.body.lname;
    var Pnumber = req.body.Pnumber
    var P_email = req.body.P_email
    var Age = req.body.Age
    var gender = req.body.gender

    var data = {
        "First_Name": fname,
        "Last_Name": lname,
        "Contact_No": Pnumber,
        "Email_ID": P_email,
        "Age": Age,
        "Gender":gender,
    }

    db.collection('patient_data').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    })
    return res.redirect('/PatientList')
});

app.get('/Appointment', (req, res) => {
    Appointdata.find({}).then((data) => {
     
        res.render('Appointment', { AppointData: data });
    
   });
});

app.post('/bookAppoint',(req, res) => {

    var fname = req.body.fname;
    var lname = req.body.lname;
    var Pnumber = req.body.Pnumber;
    var DayDate = req.body.DayDate;
    var Age = req.body.Age;
    var gender = req.body.gender

    var data = {
        "First_Name": fname,
        "Last_Name": lname,
        "Contact_No": Pnumber,
        "DayDate": DayDate,
        "Age": Age,
        "Gender":gender,
    }

    db.collection('appointment_data').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    })
    return res.redirect('/Appointment')
});

app.get('/Delete/:pid', (req, res) => {
    console.log(req.params.pid)
    let obj =  new ObjectId(req.params.pid);    
    console.log(obj)
    const deletepatient = db.collection('patient_data').deleteOne({ _id : obj }).then(function() {
        console.log("patient delete")
        return res.redirect('/PatientList');
    }).catch(function(error){
        console.log(error);
    })
});

app.get('/DeleteAppoint/:pid', (req, res) => {
    console.log(req.params.pid)
    let obj =  new ObjectId(req.params.pid);    
    console.log(obj)
    const deletepatient = db.collection('appointment_data').deleteOne({ _id : obj }).then(function() {
        console.log("Appointmented deleted")
        return res.redirect('/Appointment');
    }).catch(function(error){
        console.log(error);
    })
});

app.get('/update/:pid', (req, res) => {
    let obj =  new ObjectId(req.params.pid);
    Patientdata.findOne({_id : obj }).then((data) => {
    res.render('updatePatient', { PatientData: data });
    console.log(data)
   });
});


app.post('/updateRecord/:pid', (req, res) => {
    
    let obj =  new ObjectId(req.params.pid);    
    console.log(obj)
    const deletepatient = db.collection('patient_data').updateOne({ _id : obj },{$set: {
        First_Name : req.body.fname,
        Last_Name : req.body.lname,
        Contact_No : req.body.Pnumber,
        Email_ID : req.body.P_email,
        Age : req.body.Age,
        Gender : req.body.gender,
    }
},).then(function() {
        console.log("patient delete")
        return res.redirect('/PatientList');
    }).catch(function(error){
        console.log(error);
    })
});

app.get('/updateAppoint/:pid', (req, res) => {
    let obj =  new ObjectId(req.params.pid);
    Appointdata.findOne({_id : obj }).then((data) => {
    res.render('updateAppointment', { AppointData: data });
    console.log(data)
   });
});

app.post('/updateAppointData/:pid', (req, res) => {
    
    let obj =  new ObjectId(req.params.pid);    
    console.log(obj)
    const deletepatient = db.collection('appointment_data').updateOne({ _id : obj },{$set: {
        First_Name : req.body.fname,
        Last_Name : req.body.lname,
        Contact_No : req.body.Pnumber,
        DayDate : req.body.DayDate,
        Age : req.body.Age,
        Gender : req.body.gender,
    }
},).then(function() {
        console.log("Appintment updated")
        return res.redirect('/Appointment');
    }).catch(function(error){
        console.log(error);
    })
});



app.get('/AboutUs',(req,res)=>{
    res.render("AboutUs");
});


app.listen (3001, '0.0.0.0', function() {
    console.log("Server is running on localhost 3001");
  });
      
  console.log("Listening on PORT 3001");