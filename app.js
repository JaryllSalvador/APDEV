const express = require('express');
const server = express();
const mongoose = require('./server.js');
const handlebars = require('express-handlebars');

const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const login = require('./login.js')
server.use('/login', login);

const { Profile, server: profileRouter } = require('./profile.js');
server.use('/profile', profileRouter);

server.get('/', (req, res) => {
    res.render('main',{
        layout: 'index',
        error: req.query.error ? "Invalid username or password." : "",
        signUpError: req.query.signUpError ? "Username already exists." : ""
    });
})

server.get('/homepage', (req, res) => {
    res.render('main',{
        user : req.query.user,
        layout: 'homepage'
    });
})

server.get('/profile', async (req, res) => {
    try {

        const user = req.query.user
        console.log(user)
        const profile = await Profile.findOne({account_name : user}).exec();
        res.render('main', { 
                    layout: 'profile', 
                    user: user, 
                    firstname: profile.firstname, 
                    lastname: profile.lastname, 
                    account_name: profile.account_name, 
                    profile_email: profile.profile_email, 
                    admin_access: profile.admin_access, 
                    student_access: profile.student_access, 
                    profile_picture:profile.profile_picture 
                });

    } catch (err) {
        console.error('Error retrieving user profile:', err);
        res.status(500).send('Error retrieving user profile');
    }
});

const roomsSchema = new mongoose.Schema({
    "room-id": { type: String },
    "time-slot": { type: String },
    seats: [[[{ "seat-id": {type: Number}, "seat-order": {type: Number}, "is-occupied": {type: Boolean}, "occupant": {type: String}, "is-anon": {type: Boolean}, "id-number": {type: Number} }]]]
  },{ versionKey: false });
  
const roomsModel = mongoose.model('rooms', roomsSchema);

server.get('/search', async (req, resp) => {
    try {
        const user = req.query.user
        const profile = await Profile.findOne({account_name : req.query.profile}).exec();
        
        const res = await roomsModel.find({}).lean().exec();
        let user_reservations = [];
        res.forEach(s => { 
            s.seats.forEach(a => { 
                a.forEach(b => {
                    b.forEach(c => {
                        if(c['id-number'] == user) {
                            user_reservations.push(s)
                            s.seats = c
                        }
                    })
                })
            })
        })
        
        resp.render('main', {
            layout: 'search',
            profile: req.query.profile,
            user: user,
            firstname: profile.firstname, 
            lastname: profile.lastname,
            account_name: profile.account_name,
            profile_email: profile.profile_email,
            admin_access: profile.admin_access,
            student_access: profile.student_access,
            profile_picture: profile.profile_picture,
            reservations: user_reservations
        });
        
    } catch (err) {
        console.error('Error retrieving user profile:', err);
        resp.status(500).send('Error retrieving user profile:');
    }
});

server.get('/profile', async function(req, resp) {
    try {
        const user = req.query.user;
        const profile = await Profile.findOne({account_name : user}).exec();


        const res = await roomsModel.find({}).lean().exec();
        let user_reservations = [];

                
        admin_res = res;
        let admin_reservations = [];


        res.forEach(s => { 
            s.seats.forEach(a => { 
                a.forEach(b => {
                    b.forEach(c => {
                        if(c['id-number'] == user) {
                            user_reservations.push(s)
                            s.seats = c
                        }
                        if(c['is-occupied'] == true) {
                            admin_reservations.push(c)
                        }
                    })
                })
            })
        })

        console.log(admin_reservations);

        resp.render('main', {
            layout: 'profile',
            title: 'Profile',
            user: user,
            firstname: profile.firstname, 
            lastname: profile.lastname,
            account_name: profile.account_name,
            profile_email: profile.profile_email,
            admin_access: profile.admin_access,
            student_access: profile.student_access,
            profile_picture: profile.profile_picture,
            reservations: user_reservations, 
            admin_reservations: admin_reservations
        });

    } catch (err) {
        console.error('Error retrieving current reservations:', err);
        resp.status(500).send('Error retrieving current reservations');
    }
});


server.get('/reserve_seat', async function(req, resp){
    const user = req.query.user
    const profile = await Profile.findOne({account_name : user}).exec();
    roomsModel.find({}).lean().then(function(data){
        resp.render('main',{
            layout: 'reserve_seat',
            title: 'Reserve Seat',
            room_info: data,
            user: user,
            admin: profile.admin_access
        });
    }).catch(err => {throw err});
});

server.get('/editprofile', async (req, res) => {
    try {

        const user = req.query.user
        const profile = await Profile.findOne({account_name: user}).exec();
        res.render('main', {
            layout: 'editprofile',
            user: user,
            firstname: profile.firstname, 
            lastname: profile.lastname,
            account_name: profile.account_name,
            profile_email: profile.profile_email,
            admin_access: profile.admin_access,
            student_access: profile.student_access,
            profile_picture: profile.profile_picture
        });

    } catch (err) {
        console.error('Error retrieving user profile:', err);
        res.status(500).send('Error retrieving user profile');
    }
})
const port = process.env.PORT | 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});