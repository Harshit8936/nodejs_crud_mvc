const User = require('../models/user');




// fetch all users

const allUsers = async (req,res)=>{
    try{
        const users = await User.find();
        res.render("index",{
            title:"Home page",
            users:users,
        })
    }catch(err){
        res.json({status:400,message:err})
    }
}

// fetch single user
const singleUser = async (req,res)=>{
    try{
        let id = req.params.id;
        const user = await User.findById(id);
        if(user){
            res.render("edit_user",{title:"Update User",user:user})
        }else{
            res.redirect("/")
        }
    }catch(err){
        res.json({status:400,message:err})
    }
}

//about us
const about = async (req,res)=>{
    try{
        res.render("about",{
            title:"About Us Page"
        })
    }catch(err){
        res.json({status:400,message:err,})
    }

}

//contact us
const contact = async(req,res)=>{
    try{
        res.render("contact",{
            title:"Contact Us Page"
        })
    }catch(err){
        res.json({status:400,message:err})
    }
}



module.exports = {allUsers,singleUser,about,contact}



