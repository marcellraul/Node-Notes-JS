const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/node-notes-js',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    
    useFindAndModify: false

}).then(db => console.log('DB is Conected'))
    .catch(error => console.log(error))
    
