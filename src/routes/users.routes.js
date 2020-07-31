`--unhandled-rejections=strict`

const express = require('express')
const router = express.Router()
const Users = require('../models/Users')
const passport = require('passport')

router.get('/users/signin', (req,res) =>{
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup', (req,res) =>{
    res.render('users/signup')
})

router.post('/users/signup', async (req,res) =>{
    const { name,email,pass,confirmpass } = req.body
    /* const newusers = {
        name: name,
        pass: pass,
        email:email
    } */
    const errors = []
    if(pass.length <= 0){
        errors.push({text: 'Please insert one Password'})
    }
    if(name.length <= 0){
        errors.push({text: 'Please insert one Name'})
    }
    if(email.length <= 0){
        errors.push({text: 'Please insert one Email'})
    }

    if(pass != confirmpass){
         errors.push({text: 'Password not match'})
    }
    if (pass.length < 4){
        errors.push({text: 'Password must be least 4 Characters'})
    }
    if(errors.length > 0){
        res.render('users/signup',{ errors,name,email,pass,confirmpass})
    }
    const emailUser = await Users.findOne({email: email})
    if(emailUser) {
        req.flash('error_email', 'Email is already in used!')
        console.log('correo en uso');
        res.redirect('/users/signup');
     //   res.render('users/signup',{ errors,name,email,pass,confirmpass})
    }
    else {
        const newuser = new Users({ name,email,pass,})
        newuser.pass = await newuser.encryptPass(pass)
        await newuser.save()
        console.log(newuser)
        req.flash('success_msg', 'User Added successfuly')
        //console.log('Saving User')
        //console.log(req.body)
        res.redirect('/users/signin')
    }
})

router.get('/users/logout', (req,res) =>{
    req.logOut()
    res.redirect('/')
})
module.exports = router