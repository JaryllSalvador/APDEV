

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    display_name: String,
    account_name: String,
    student_access: Boolean,
    admin_access: Boolean,
    profile_email:String,
    profile_picture: String
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
