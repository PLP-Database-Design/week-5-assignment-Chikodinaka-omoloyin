//import our dependencies
const express = require('express');
const app = express();
const mysql=require('mysql2');
const dotenv=require('dotenv');
const cors=require('cors');

//configure environment variables
dotenv.config();
app.use(express.json());
app.use(cors());


//create a connection object
const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_hospital,
})

//test the connection
db.connect((err)=>{
//if connection is not successful
if(err)
    return console.log("Error connecting to the database:",err);
//connection is successful
console.log("Successfully connected to MYSQL:",db.threadId)
})

//1.retrieve all patients
app.get('/patients',(req,res)=>{
    const getPatients="SELECT patient_id,first_name,last_name,date_of_birth FROM patients"
    db.query(getPatients,(err,result)=> {
        if(err){
            return res.status(400).send("Failed to get Patients",err)
        }
    res.status(200).send(data)})

});
// 2. Retrieve all providers with first_name, last_name, and provider_specialty
app.get('/providers', (req, res) => {
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers";
    db.query(getProviders, (err, result) => {
        if (err) {
            return res.status(400).send("Failed to retrieve providers");
        }
        res.status(200).send(result);
    });
});

// 2. Filter patients by First Name
app.get('/patients', (req, res) => {
    const { first_name } = req.query; // Get first name from query parameters
    let getPatients = "SELECT first_name, last_name FROM patients";
    
    // Add a WHERE clause if a first name is provided
    if (first_name) {
        getPatients += " WHERE first_name = ?";
    }

    db.query(getPatients, [first_name], (err, result) => {
        if (err) {
            return res.status(400).send("Failed to retrieve patients");
        }
        res.status(200).send(result);
    });
});

// 3. Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
    const { specialty } = req.query; // Get specialty from query parameters
    let getProvidersBySpecialty = "SELECT first_name, last_name, provider_specialty FROM providers";
    
    // Add a WHERE clause if a specialty is provided
    if (specialty) {
        getProvidersBySpecialty += " WHERE provider_specialty = ?";
    }

    db.query(getProvidersBySpecialty, [specialty], (err, result) => {
        if (err) {
            return res.status(400).send("Failed to retrieve providers by specialty");
        }
        res.status(200).send(result);
    });
});

//start and listen to the server
app.listen(5000,()=>{
    console.log(`Server is running on port 5000...`)
})

