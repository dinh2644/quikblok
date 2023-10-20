const test = (req,res) =>{
    res.json('test is working');
}

// Register user
const UserModel = require("../models/Users");
const registerUser = async(req,res) =>{
    try {
        const {email,firstName,lastName,username,password} = req.body;
        // Check if all field has an input
        if(!(email || firstName || lastName || username || password)){
            return res.json({error: 'All fields are required!'})
        }
        // Check if email is taken
        const emailExist = await UserModel.findOne({email});
        if(emailExist){
            return res.json({error:'Email is taken already!'})
        }

        // Check if username is taken
        const userNameExist = await UserModel.findOne({username});
        if(userNameExist){
            return res.json({
                error: 'Username is taken already!'
            })
        }
        // Check if password is good
        if(!password || password.length < 6){
            return res.json({error: 'Password is required and should be at least 6 characters long!'})
        }
        
        const user = await UserModel.create({email,firstName,lastName,username,password})

        return res.json(user);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    test,
    registerUser,
}