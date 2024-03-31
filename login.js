const mongoose = require('./server.js');
const express = require('express');
const bcrypt = require('bcrypt'); // Ensure bcrypt is required
const server = express.Router();
const loginModel = require('./models.js');

server.post('/read-user', (req, resp) => {
    const searchQuery = { user: req.body.user };

    loginModel.findOne(searchQuery).then(function(login){
        if(login != undefined && login._id != null){
            bcrypt.compare(req.body.pass, login.pass, function(err, isMatch) {
                if (err) throw err;

                if (isMatch) {
                    resp.redirect(`/homepage?user=${req.body.user}`);
                } else {
                    resp.redirect('/?error=true'); 
                }
            });
        } else {
            resp.redirect('/?error=true'); 
        }
    }).catch(err => {
        throw err;
    });
});

module.exports = server;