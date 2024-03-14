const mongoose = require('./server.js');
const express = require('express');
const server = express.Router();

const profileSchema = new mongoose.Schema({
    display_name: String,
    account_name: String,
    student_access: Boolean,
    admin_access: Boolean,
    profile_email:String,
    profile_picture: String
});

const Profile = mongoose.model('profiles', profileSchema);

module.exports = Profile;
