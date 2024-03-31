const mongoose = require('./server.js');

const loginSchema = new mongoose.Schema({
    user: { type: String },
    pass: { type: String }
},{ versionKey: false });

const loginModel = mongoose.model('login', loginSchema);

module.exports = loginModel