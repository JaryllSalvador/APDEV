const mongoose = require('./server.js');
const express = require('express');
const server = express.Router();
const loginModel = require('./models.js')

server.post('/read-user', (req, resp) => {
    const searchQuery = { user: req.body.user, pass: req.body.pass };
  
    loginModel.findOne(searchQuery).then(function(login){
  
      if(login != undefined && login._id != null){
        resp.redirect(`/homepage?user=${req.body.user}`) 

      }else{
        resp.redirect('/?error=true'); 
      }
    }).catch(err => {throw err});
});

module.exports = server