const express = require('express');
const cors = require('cors'); 
const sgMail = require('@sendgrid/mail'); 

require('dotenv').config();

const app = express(); 

//sendgrid api key
const API_KEY = process.env.SENDGRID_API_KEY

sgMail.setApiKey(API_KEY);

app.use(cors()); 


app.get('/', (req, res) => {
    res.send("Welcome to the Sendgrid Emailing Server"); 
});

app.get('/send-email', (req,res) => {
    
    //Get Variables from query string in the search bar
    const { recipient, sender, topic, text } = req.query; 

    //Sendgrid Data Requirements
    const msg = {
        to: recipient, 
        from: sender,
        subject: topic,
        text: text,
    }

    //Send Email
    sgMail.send(msg)
    .then((msg) => console.log(text));
});
