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
            user_id: user,
            user_f: profile.firstname,
            user_l: profile.lastname,
            admin: profile.admin_access
        });
    }).catch(err => {throw err});
});

server.post('/create_reservation', (req, resp) => {
    // console.log("nakapasok sa reserve");

    // console.log(typeof req.body.room_id + " " + req.body.room_id);
    // console.log(typeof parseInt(req.body.seat_id) + " " + parseInt(req.body.seat_id));
    // console.log(typeof req.body.fullname + " " + req.body.fullname);
    // console.log(typeof Boolean(req.body.anon) + " " + Boolean(req.body.anon));
    // console.log(typeof parseInt(req.body.account_id) + " " + parseInt(req.body.account_id));

    const roomQuery = { 'room-id': req.body.room_id, 'time-slot': req.body.time };
    
    roomsModel.findOne(roomQuery).then(function(room){
    
        // Iterate over the outermost array
        for (let i = 0; i < room.seats.length; i++) {
            const outerArray = room.seats[i];
            // Iterate over the middle array
            for (let j = 0; j < outerArray.length; j++) {
                const middleArray = outerArray[j];
                // Iterate over the middle array
                for (let k = 0; k < middleArray.length; k++) {
                    const object = middleArray[k];
                    
                    if(object['seat-id'] === parseInt(req.body.seat_id))
                    {
                        console.log(object);
                        object['is-occupied'] = true;
                        object['occupant'] = req.body.fullname;
                        object['is-anon'] = req.body.anon;
                        object['id-number'] = parseInt(req.body.account_id);
                        console.log(object);
                        break;
                    }
                }
            }
        }
        
        // console.log(room);
        // console.log();
        // console.log(room.seats);

        room.save().then(function(result) {
            if(result)
                console.log('Seat updated successfully!');
        }).catch(err => {
            console.error('Error saving room:', err);
        });
    }).catch(err => {
        throw err;
    });
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