const router = require('express').Router();

const User = require('../model/User');

const {registerValidation, loginValidation} = require('../validation');

const bcrypt = require('bcryptjs');


const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    //Lets Validate  the data

    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    //checking if the user is already in the database

    const emailExist = await User.findOne({email: req.body.email});

    if (emailExist) return res.status(400).send('Email already exist');


    //Hash password

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const saveUser = await user.save();
        res.send(saveUser)
    } catch (e) {
        res.status(400).send(e)
    }
});


//LOGIN

router.post('/login', async (req, res) => {

    //Lets Validate  the data
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in the database

    const user = await User.findOne({email: req.body.email});

    if (!user) return res.status(400).send('Email or password is wrong');

    //    PassWord is correct

    const validPass = await bcrypt.compare(req.body.password, user.password);

    //checking validPass

    if (!validPass) return res.status(400).send('Invalid Password');

    //  Create and assign a token

    const token = jwt.sign({_id: user._id}, 'dsdasdsadfdfdf');
     
    res.header('auth-token', token).send(token)
});
module.exports = router;
