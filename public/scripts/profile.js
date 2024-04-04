const mongoose = require('../../server.js');
const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const server = express.Router();
const loginModel = require('../../models.js')

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
function toggleEditMode() {
    console.log("CALLED");
    const firstname = document.querySelector('.firstname');
    const lastname = document.querySelector('.lastname');
    const profilePicture = document.getElementById('profile-picture')
    const profileemail = document.getElementById('profileemail')
    const accountname = document.getElementById('accountname');
    const editProfile = document.querySelector('.edit-button')

    if (firstname.contentEditable == 'false' || !firstname.hasAttribute("contentEditable") || !firstname.hasAttribute("contenteditable") ) {
        firstname.contentEditable = true;
        lastname.contentEditable = true;
        profileemail.contentEditable = true;
        editProfile.textContent = 'Save Account';
    } else {
        // disable edit
        firstname.contentEditable = false;
        lastname.contentEditable = false;
        profileemail.contentEditable = false;
        editProfile.textContent = 'Edit Account';

        //for editing the db itself
        fetch('/edit-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                profile_email: profileemail.textContent,
                firstname: firstname.textContent,
                lastname: lastname.textContent,
                account_name: accountname.textContent}) // pass email of user to be edited (key)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit profile');
                }
                // action after editing
                // viewPage('');
            })
            .catch(error => {
                console.error('Error editing profile:', error);
            });

    }
}
function deleteProfile() {
    const accountname = document.getElementById('accountname');
    // AJAX req to delete profile
    fetch('/delete-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  account_name: accountname.textContent }) // pass email of user to be deleted (key)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete profile');
            }
            // action after deletion
            window.location.href="/";
        })
        .catch(error => {
            console.error('Error deleting profile:', error);
        });

}
module.exports = { Profile, server }
