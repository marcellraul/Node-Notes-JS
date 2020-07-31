`--unhandled-rejections=strict`

const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const {isAuthenticated} = require('../helpers/auth')

router.get('/notes',isAuthenticated, async (req, res) => {
    await Note.find().sort({createdAt:'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                _id: documento._id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/all-notes', {
            notes: contexto.notes }) 
      })
  })

router.get('/notes/add', isAuthenticated , (req,res) =>{
    res.render('notes/new-notes')
})

router.post('/notes/add',isAuthenticated, async (req,res) =>{
    const {title, description} = req.body //lo que mandamos en la vista
    const newNote = {
        title : title,
        description : description
    }
    const errors = []
    if(!title){
        errors.push({text: 'Please Write a Title!'})
        }
    if(!description){
        errors.push({text: 'Please Write a Description!'})
        } 
    if(errors.length >0 ){
        res.render('notes/new-notes',{
            errors,
            title,
            description
        })
        } 
    else{
        const note = new Note(newNote)
        await note.save()
        console.log('Saving Note')
        req.flash('success_msg', 'Note Added successfuly')
        res.redirect('/notes')
        console.log(req.body)
        return res.json({
            message: 'Note successfuly saved',
            note
        })
        //res.send('ok')
    }
})


router.get('/notes/edit/:id',isAuthenticated, async (req,res) =>{
    const id = req.params.id
    const note = await Note.findById(id)
    .then(data =>{
        return {
            title:data.title,
            description:data.description,
            _id:data.id
        }
    })
    res.render('notes/edit-note', {note})
})

router.put('/notes/edit-note/:id',isAuthenticated, async (req,res) =>{
    const {title,description} = req.body;
     const note = await Note.findByIdAndUpdate(req.params.id,{title, description}, {new : true});
     console.log('note:', note);
     //res.json({message:  'Notes Update',note})
     req.flash('success_msg', 'Note Updated successfuly')
     res.redirect(('/notes'))
     //req.flash('success_msg', 'note Updated succesfully');
})

router.delete('/notes/delete/:id',isAuthenticated, async (req,res) =>{
    const id =console.log(req.params.id)
    const notedelete= await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Note Deleted successfuly')
    res.redirect('/notes')
})

module.exports = router