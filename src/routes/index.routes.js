const express = require('express')
const router = express.Router()


router.get('/', (req,res)=>{
    res.render('index')//le enviamos el hbs aca que tenemos en el views
})

router.get('/about', (req,res)=>{
    res.render('about')
})

module.exports = router