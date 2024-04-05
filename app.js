const express = require('express');
const server = express();
const mongoose = require('./server.js');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
const loginModel = require('./models.js');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
  
const session = require('express-session');
server.use(session({
    secret: '#LiveLaughLoveGhee',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60*60*1000 }
}));

server.use(express.static('public'));

const login = require('./login.js')
server.use('/login', login);

const { Profile, server: profileRouter } = require('./profile.js');
server.use('/profile', profileRouter);


server.get('/', (req, res) => {

    req.session.user_id = null;
    req.session.username = null;
    req.session.firstname = null;
    
    req.session.destroy();
    
    res.render('main',{
        layout: 'index',
        error: req.query.error ? "Invalid username or password." : "",
        signUpError: req.query.signUpError ? "Username already exists." : "",
        updatePassSuccess: req.query.updatePassSuccess ? "Password updated successfully!" : "",
    });
})

server.get('/homepage', (req, res) => {
    if(req.session.user_id == null){
        return res.redirect('/')
    }
    
    res.render('main',{
        user : req.session.username,
        layout: 'homepage'
    });
})
  
const roomsSchema = new mongoose.Schema({
    "room-id": { type: String },
    "time-slot": { type: String },
    seats: [[[{ "seat-id": {type: Number}, "seat-order": {type: Number}, "is-occupied": {type: Boolean}, "occupant": {type: String}, "is-anon": {type: Boolean}, "id-number": {type: Number} }]]]
  },{ versionKey: false });
  
const roomsModel = mongoose.model('rooms', roomsSchema);

  server.get('/search', async (req, resp) => {
    if(req.session.user_id == null){
        return resp.redirect('/')
    }
    
    try {
        const user = req.session.username
        const profile = await Profile.findOne({account_name : req.query.profile}).exec();
        
        const res = await roomsModel.find({}).lean().exec();
        let user_reservations = [];
        res.forEach(s => { 
            s.seats.forEach(a => { 
                a.forEach(b => {
                    b.forEach(c => {
                        if(c['id-number'] == profile.account_name && c['is-anon'] == false) {
                            let seat_reservation = { room: s['room-id'], time: s['time-format'], seat: c['seat-order'] }
                            user_reservations.push(seat_reservation);
                        }
                    })
                })
            })
        })

        //console.log(user_reservations);

        user_reservations.forEach(a => {
            a['seat'] += 1;
        })

        //console.log(user_reservations);
        
        console.log("HELLOSDFISDJFISJDF" + user_reservations);

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
    if(req.session.user_id == null){
        return resp.redirect('/')
    }
    
    try {
        const user = req.session.username;
        const profile = await Profile.findOne({account_name : user}).exec();


        const res = await roomsModel.find({}).lean().exec();
        let user_reservations = [];
        let admin_reservations = [];
        res.forEach(s => { 
            s.seats.forEach(a => { 
                a.forEach(b => {
                    b.forEach(c => {
                        if(c['id-number'] == user) {
                            let user_reservation = { room: s['room-id'], time: s['time-format'], seat: c['seat-order'] }
                            user_reservations.push(user_reservation);
                        }
                        if(c['is-occupied'] == true) {
                            let admin_reservation = { occupant: c['occupant'], room: s['room-id'], time: s['time-format'], seat: c['seat-order'] }
                            admin_reservations.push(admin_reservation);
                        }
                    })
                })
            })
        })

        user_reservations.forEach(a => {
            a['seat'] += 1;
        })

        admin_reservations.forEach(a => {
            a['seat'] += 1;
        })
        
        //console.log(user_reservations);
        //console.log(admin_reservations);

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

server.post('/edit-profile', async (req, res) => {
    if(req.session.user_id == null){
        return res.redirect('/')
    }
    
    try {
        const userfirstname = req.body.firstname;
        const userlastname =req.body.lastname;
        const accountname = req.body.account_name;
        const profileemail = req.body.profile_email;

        const updatedUser = await Profile.findOneAndUpdate(
            { account_name: accountname },
            { firstname: userfirstname, lastname: userlastname,profile_email: profileemail}, 
            { new: true } 
        );


        if (updatedUser) {
            console.log(`User with account name ${accountname} edited successfully.`);
            res.status(200).send('Profile edited successfully');
        } else {
            console.log(`User with account name ${accountname} not found.`);
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error editing user profile:', error);
        res.status(500).send('An error occurred while editing user profile');
    }
});
server.post('/delete-profile', async (req, res) => {
    try {
        const accountname = req.body.account_name;
        const user = await Profile.findOneAndDelete({ account_name: accountname });
        const login = await loginModel.findOneAndDelete({ user: accountname });
        if (user) {
            console.log(`User with account ${accountname} deleted successfully.`);
            res.status(200).send('Profile deleted successfully');
        } else {
            console.log(`User with account ${accountname} not found.`);
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error deleting user profile:', error);
        res.status(500).send('An error occurred while deleting user profile');
    }
});
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // dir where files will be saved
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        // filename
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

server.post('/uploadProfilePicture', upload.single('picture'), async (req, res) => {
    if(req.session.user_id == null){
        return res.redirect('/')
    }
    const pfpURL = req.file.path.replace(/\\/g, '/').replace('public', ''); //reverses all slashes
    const accountname = req.session.username;

    const updateUserPicture = await Profile.findOneAndUpdate(
        { account_name: accountname }, //find by email
        { profile_picture: pfpURL }, //update url
        { new: true } //return updated document
    ).lean();

    res.sendStatus(200);
});

server.get('/reserve_seat', async function(req, resp){
    if(req.session.user_id == null){
        return resp.redirect('/')
    }
    const user = req.session.username
    const profile = await Profile.findOne({account_name : user}).exec();
    roomsModel.find({}).lean().then(function(data){
        resp.render('main',{
            layout: 'reserve_seat',
            title: 'Reserve Seat',
            room_info: data,
            user: user,
            user_f: profile.firstname,
            user_l: profile.lastname,
            admin: profile.admin_access
        });
    }).catch(err => {throw err});
});

server.post('/create_reservation', (req, resp) => {
    if(req.session.user_id == null){
        return resp.redirect('/')
    }
    const roomQuery = { 'room-id': req.body.room_id, 'time-slot': req.body.time };
    
    roomsModel.findOne(roomQuery).then(function(room){
    
        let object, found = 0;
        // Iterate over the outermost array
        for (let i = 0; i < room.seats.length && !found; i++) {
            const outerArray = room.seats[i];
            // Iterate over the middle array
            for (let j = 0; j < outerArray.length && !found; j++) {
                const middleArray = outerArray[j];
                // Iterate over the middle array
                for (let k = 0; k < middleArray.length && !found; k++) {
                    object = middleArray[k];
                    
                    if(object['seat-id'] === parseInt(req.body.seat_id))
                    {
                        object['is-occupied'] = true;
                        object['occupant'] = req.body.fullname;
                        object['is-anon'] = req.body.anon;
                        object['id-number'] = parseInt(req.body.account_id);
                        found = 1;
                    }
                }
            }
        }

        const newRoom = new roomsModel(room);

        newRoom.save().then(function(result) {
            if(result)
                console.log('Seat updated successfully!');
                //console.log(object);
                resp.send({ seat: object });
            }).catch(err => {
                console.error('Error saving room:', err);
            });
        }).catch(err => {
            throw err;
        });
});
    
server.post('/delete_reservation', (req, resp) => {
    if(req.session.user_id == null){
        return resp.redirect('/')
    }
        const roomQuery = { 'room-id': req.body.room_id, 'time-slot': req.body.time };
        
        roomsModel.findOne(roomQuery).then(function(room){
            
            let object, found = 0;
            // Iterate over the outermost array
            for (let i = 0; i < room.seats.length && !found; i++) {
                const outerArray = room.seats[i];
                // Iterate over the middle array
                for (let j = 0; j < outerArray.length && !found; j++) {
                    const middleArray = outerArray[j];
                    // Iterate over the middle array
                    for (let k = 0; k < middleArray.length && !found; k++) {
                        object = middleArray[k];
                        
                        if(object['seat-id'] === parseInt(req.body.seat_id))
                        {
                            object['is-occupied'] = false;
                            object['occupant'] = "none";
                            object['is-anon'] = false;
                            object['id-number'] = null;
                            found = 1;
                        }
                    }
                }
            }
            
            const newRoom = new roomsModel(room);
            

        newRoom.save().then(function(result) {
            if(result)
                console.log('Seat deleted successfully!');
            resp.send({ seat: object });
        }).catch(err => {
            console.error('Error saving room:', err);
        });
    }).catch(err => {
        throw err;
    });
});

server.post('/create_reservation2', (req, resp) => {
    if(req.session.user_id == null){
        return resp.redirect('/')
    }
    
    const roomQuery = { 'room-id': req.body.room_id, 'time-slot': req.body.time };
    
    roomsModel.findOne(roomQuery).then(function(room){

        const profile = Profile.findOne({account_name : req.body.account_id}).then(function(profile){

            
        if (profile !== null) {
            let fullname = profile.lastname + " " + profile.firstname;

    
        let object, found = 0;
        // Iterate over the outermost array
        for (let i = 0; i < room.seats.length && !found; i++) {
            const outerArray = room.seats[i];
            // Iterate over the middle array
            for (let j = 0; j < outerArray.length && !found; j++) {
                const middleArray = outerArray[j];
                // Iterate over the middle array
                for (let k = 0; k < middleArray.length && !found; k++) {
                    object = middleArray[k];
                    
                    if(object['seat-id'] === parseInt(req.body.seat_id))
                    {
                        object['is-occupied'] = true;
                        object['occupant'] = fullname;
                        object['is-anon'] = req.body.anon;
                        object['id-number'] = parseInt(req.body.account_id);
                        found = 1;
                    }
                }
            }
        }

        const newRoom = new roomsModel(room);

        newRoom.save().then(function(result) {
            if(result)
                console.log('Seat updated successfully!');
                //console.log(object);
                resp.send({ seat: object, valid_status: true, fullname: fullname });
            }).catch(err => {
                console.error('Error saving room:', err);
            });
        }
        else {
            console.log("INVALID IDDDD");
            resp.send({ valid_status: false});
        }
        }).catch(err => {
            console.log("invalid id");
            throw err;
        });

        }).catch(err => {
            throw err;
        });
    });

const port = process.env.PORT | 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});