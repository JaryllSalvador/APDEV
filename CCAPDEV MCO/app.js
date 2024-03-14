const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');

server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const login = require('./login.js')
server.use('/login', login);

server.get('/', (req, res) => {
    res.render('main',{
        layout: 'index',
        error: req.query.error == null ? "" : "Username and password does not match."
      });
})



// server.get('/reserve_seat', (req, res) => {
//     res.render('main',{
//         user : req.query.user,
//         layout: 'reserve_seat'
//     });
// })


const roomsSchema = new mongoose.Schema({
    "room-id": { type: String },
    "time-slot": { type: String },
    seats: [[[{ "seat-id": {type: Number}, "seat-order": {type: Number}, "is-occupied": {type: Boolean}, "occupant": {type: String}, "id-number": {type: Number} }]]]
  },{ versionKey: false });
  
const roomsModel = mongoose.model('rooms', roomsSchema);

server.get('/', function(req, resp){
    roomsModel.find({}).lean().then(function(data){
        resp.render('main',{
            layout: 'reserve_seat',
            title: 'Reserve Seat',
            room_info: data
        });
    }).catch(err => {throw err});
});


const Profile = require('./profile');
server.get('/profile', async (req, res) => {
    try {
        const user = req.query.user
        console.log(user)
        const profile = await Profile.findOne({account_name : user}).exec();
        res.render('main', { layout: 'profile', user: user, display_name: profile.display_name ,account_name:profile.account_name ,profile_email:profile.profile_email, admin_access:profile.admin_access, student_access:profile.student_access,profile_picture:profile.profile_picture });

    } catch (err) {
        console.error('Error retrieving user profile:', err);
        res.status(500).send('Error retrieving user profile');
    }
});
server.get('/homepage', (req, res) => {
    res.render('main',{
        user : req.query.user,
        displayname : req.query.display_name,
            layout: 'homepage'
});
})

server.get('/editprofile', async (req, res) => {
    try {

        const user = req.query.user
        console.log(user)
        const profile = await Profile.findOne({account_name: user}).exec();
        res.render('main', {
            layout: 'editprofile',
            user: user,
            display_name: profile.display_name,
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
const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});