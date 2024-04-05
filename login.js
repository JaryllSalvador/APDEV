const mongoose = require('./server.js');
const express = require('express');
const bcrypt = require('bcrypt'); 
const server = express.Router();
const loginModel = require('./models.js');
const profileModel = require('./profile.js');


server.post('/read-user', async (req, resp) => {
    let errors = ''
    const searchQuery = { user: req.body.user };
    
    loginModel.findOne(searchQuery).then(function(login){
        if(login != undefined && login._id != null){
            bcrypt.compare(req.body.pass, login.pass, async function(err, isMatch) {
                if (err) throw err;

                if (isMatch) {
                    console.log(req.body)
                    req.session.user_id = login._id
                    req.session.username = login.user
                    
                    if(req.body.rememberMe != null){
                        req.session.cookie.maxAge = 3*7*24*60*60000
                    }
                    resp.redirect(`/homepage`);
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

server.post('/update-password', async (req, res) => {
  try {
        const { email, newpass } = req.body;
        const existing_user = await profileModel.Profile.findOne({ profile_email: email });
        const existing_login = await loginModel.findOne({ user: existing_user.account_name });
          
        if (!existing_user) {
        return res.status(400).send('Email not found');
        }
        
        const hashed_newpass = await bcrypt.hash(newpass, 10);
        existing_login.pass = hashed_newpass;
        
        await existing_login.save();

        res.redirect('/?updatePassSuccess=true'); 
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Error updating password');
  }
});


module.exports = server;