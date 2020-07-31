
const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

const UsersSchema = new Schema ({
    name : { type: String, required: true},
    pass: { type: String, required : true},
    email: { type:String,required:true}
    
}, {timestamps:true})

UsersSchema.methods.encryptPass = async (pass) =>{
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(pass,salt)
    return hash
}

UsersSchema.methods.matchPass =  async function (pass){
    return await bcrypt.compare(pass, this.pass)
}

module.exports = mongoose.model('User', UsersSchema)