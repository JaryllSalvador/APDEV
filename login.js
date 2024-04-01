const mongoose = require('./server.js');
const express = require('express');
const bcrypt = require('bcrypt'); 
const server = express.Router();
const loginModel = require('./models.js');


server.post('/read-user', (req, resp) => {
    console.log("hello")
    
    let errors = ''
    const searchQuery = { user: req.body.user };
    
    // if(req.body.user == null){
    //     errors += 'u'
    // }
    
    // if(req.body.pass == null){
    //     errors += 'p'
    // }
    
    // if(errors != null){
    //     return resp.redirect(`/?error=${errors}`); 
    // }
    
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

// server.post('/update-password', async (req, res) => {
//   try {
//       const { user, currentpass, newpass } = req.body;
//       const existing_user = await loginModel.findOne({ user: user });

//       if (!existing_user) {
//           return res.status(400).send('User not found');
//       }

//       const pass_match = await bcrypt.compare(currentpass, existing_user.pass);
//       if (!pass_match) {
//           return res.status(400).send('Current password is incorrect');
//       }

//       const hashed_newpass = await bcrypt.hash(newpass, 10);

//       existing_user.pass = hashed_newpass;
//       await existing_user.save();

//       res.send('Password updated successfully');
//   } catch (error) {
//       console.error('Error updating password:', error);
//       res.status(500).send('Error updating password');
//   }
// });


module.exports = server;