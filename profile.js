const mongoose = require('./server.js');
const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const server = express.Router();
const loginModel = require('./models.js')

const profileSchema = new mongoose.Schema({
    firstname: { type: String, required: true }, 
    lastname: { type: String, required: true }, 
    account_name: { type: String, required: true }, 
    student_access: Boolean,
    admin_access: Boolean,
    profile_email: { type: String, required: true }, 
    profile_picture: { type: String, default: '' }
},{ versionKey: false });

const Profile = mongoose.model('profiles', profileSchema);

server.post('/create-user', async (req, res) => {
    try {    
        const { firstname, lastname, account_name, profile_email, password } = req.body;
        
        const hashed_password = await bcrypt.hash(password, 10);
        
        const newUser = new Profile({
            firstname: firstname,
            lastname: lastname,
            account_name: account_name,
            profile_email: profile_email,
            student_access: true,
            admin_access: false,
            profile_picture: 'images/default_avatar.png'
        });
        
        Profile.findOne({account_name: account_name}).then(async function(login){
            if(login != undefined && login._id != null){
                res.redirect('/?signUpError=user'); 
            }
            else{
                
                await newUser.save();
        
                const newLogin = new loginModel({
                    user: account_name,
                    pass: hashed_password
                });
                await newLogin.save();
        
                res.redirect(`/homepage?user=${req.body.account_name}`)
            }
        });
                
                 
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});
module.exports = { Profile, server }
