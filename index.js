const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dotenv = require('dotenv');
dotenv.config();
// const router = express.Router();
// router.use(express.json());
const bcryptjs = require('bcryptjs')

const PORT = process.env.PORT || 9300;
const DATABASE = "mongodb+srv://Sagarbehera:Sagar456@cluster0.96hmj.mongodb.net/eduInternJan?retryWrites=true&w=majority";

const db = require('./configs/config').get(process.env.NODE_ENV);
const User = require('./models/users');
const { auth } = require('./middleware/auth');
const users = require('./models/users');
const cors = require('cors')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors());
// router.use(cors());


MongoClient.connect(DATABASE, (err, client) => {
    if (err) console.log(`Error While Connecting`);
    user = client.db('eduInternJan');
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
})

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) console.log(err);
    console.log("database is connected");
})


app.get('/', function (req, res) {
    res.status(200).send("welcome to login, signup Api")
})


// adding new user (sign-up route)
app.post('/api/register', async function (req, res) {
    // taking a user

    const newUser = await new users(req.body);
    if (newUser.password != newUser.password2) return res.status(400).json({ message: "password not match" });
    User.findOne({ email: newUser.email }, function (err, user) {
        if (user) return res.status(400).json({ auth: false, message: "email exits" });
        // } else {
        //     // Insert the new user if they do not exist yet
        //  user.create({
        //         id: req.body._id,
        //         firstname: req.body.firstname,
        //         lastname: req.body.lastname,
        //         email: req.body.email,
        //         password: newUser.password,
        //         password2: newUser.password2,
        //     });
            // const salt = await bcryptjs.genSalt(10);
            // user.password = await bcryptjs.hash(user.password, salt);
            // await user.save();
            // res.send(user);
        // }


        newUser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ success: false });
            }
            res.status(200).json({
                success: true,
                user: doc
            });
        });
    });
})

app.post('/api/login', function (req, res) {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) return res(err);
        if (user) return res.status(400).json({
            error: true,
            message: "You are already logged in"
        });

        else {
            User.findOne({ 'email': req.body.email }, function (err, user) {
                if (!user) return res.json({ isAuth: false, message: ' Auth failed ,email not found' });

                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (!isMatch) return res.json({ isAuth: false, message: "password doesn't match" });

                    user.generateToken((err, user) => {
                        if (err) return res.status(400).send(err);
                        res.cookie('auth', user.token).json({
                            isAuth: true,
                            id: user._id
                            , email: user.email
                        });
                    });
                });
            });
        }
    });
});


// get logged in user
app.get('/api/profile', auth, function (req, res) {
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.firstname + req.user.lastname

    })
});


//logout user
app.get('/api/logout', auth, function (req, res) {
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.sendStatus(200);
    });

});

// listing port
// const PORT = process.env.PORT || 2000;

// app.listen(PORT, () => {
//     console.log(`app is running ${PORT}`)
// })