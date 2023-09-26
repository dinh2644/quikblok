const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: string,
        required: true,
        unique: true,
    },
    firstName:{
        type:string,
        required:true,
    },
    lastName:{
        type:string,
        required:true,
    },
    password:{
        type:string,
        required: true,
    }
})

const UserModel = mongoose.model("User",UserSchema);
module.export = UserModel;