const express = require('express')
const path = require('path')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const es = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

//initializations
const app = express()
require('./database')
require('./config/passport')
//settins
app.set('port', process.env.PORT || 3000)

app.set('views', path.join(__dirname,'views') ) //para llamar a la carpeta views
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'), //pequeñas partes de htl para reutilizar
    extname: '.hbs'
}))

app.set('view engine','.hbs')

//middlewares
//app.use(bw())
app.use(express.urlencoded({extended: false})) //obtener sus daros del usuario
app.use(methodOverride('_method'))//otros tipos de metodos, put delete
app.use(es({// por defecto, para autenticar
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
    }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Global Variables
app.use((req,res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error = req.flash('error')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error_email = req.flash('error_email')
    res.locals.user = req.user || null
    next()
    })
//routes

app.use(require('./routes/index.routes'))
app.use(require('./routes/notes.routes'))
app.use(require('./routes/users.routes'))

//Stitic Files
app.use(express.static(path.join(__dirname, 'public')))

//server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port') )
})

module.exports = app;