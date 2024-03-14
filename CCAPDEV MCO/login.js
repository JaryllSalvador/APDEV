const mongoose = require('./server.js');
const express = require('express');
const server = express.Router();

const loginSchema = new mongoose.Schema({
    user: { type: String },
    pass: { type: String }
},{ versionKey: false });

const loginModel = mongoose.model('login', loginSchema);

// server.use(express.urlencoded({ extended: true }));

server.post('/read-user', (req, resp) => {
    const searchQuery = { user: req.body.user, pass: req.body.pass };
  
    loginModel.findOne(searchQuery).then(function(login){
      console.log('Finding user');
  
      if(login != undefined && login._id != null){
       
        // - TODO: sa gagawa ng profile, change this nalang to pass the data u need from mongoose
        resp.redirect(`/profile?user=${req.body.user}`) 

      }else{
      // - TODO: error screen
        resp.redirect('/?error=true'); 
      }
    }).catch(err => {throw err});
});

module.exports = server