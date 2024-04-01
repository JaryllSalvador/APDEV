const mongoose = require('./server.js');
const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const server = express.Router();
const login = require('./models.js')

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

const validateUserInput = [
    body('firstname')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .matches(/^[A-Z]/)
        .withMessage('First name must start with a capital letter'),

    body('lastname')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .matches(/^[A-Z]/)
        .withMessage('Last name must start with a capital letter'),

    body('account_name')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 8, max: 8 })
        .withMessage('Username must have 8 characters')
        .isNumeric()
        .withMessage('Username must contain only numbers'),

    body('profile_email')
        .isEmail()
        .withMessage('Invalid email address'),

    body('password')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

server.post('/create-user', validateUserInput, async (req, res) => {
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
            profile_picture: ''
        });
        await newUser.save();
        
        const newLogin = new login({
            user: account_name,
            pass: hashed_password
        });
        await newLogin.save();
        
        res.redirect(`/homepage?user=${req.body.account_name}`) 
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

module.exports = { Profile, server }
