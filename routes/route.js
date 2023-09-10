const router = require('express').Router();
const User = require('../models/user');
const multer = require('multer');
const fs = require('fs');

// image upload
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})
var upload = multer({
    storage:storage,
}).single('image')          // name attribute here 

// add new user post api
router.post("/addUser",upload,(req,res)=>{
     const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename,
        status:true,
     });
     try {
        let saveUser = newUser.save()
        // res.send(saveUser); 
        req.session.message={
            type:"success",
            message:"user added successfully"
        }
        res.redirect("/");    

    } catch (error) {
        res.status(400).send(error)
        // res.json({message:err.message, type:'danger'})
    }
})

// get all users list
router.get("/",async (req,res)=>{
    try{
        const users = await User.find();
        res.render("index",{
            title:"Home page",
            users:users,
        })
    }catch(err){
        res.json({status:400,message:err})
    }

})

// Add new user
router.get("/add",(req,res)=>{
    res.render("add_user",{title:"Add User"})
})

// update an existing  user

router.get("/edit/:id",async (req,res)=>{
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
})


router.post("/updateUser/:id",upload,async(req,res)=>{
try {
    let new_image = '';
    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync("./uploads/" + req.body.old_image);
        }catch(err){
            console.log(err)
        }
    }else{
        new_image = req.body.old_image
    }

        const user={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            image:new_image,
        }
        let updateUser = await User.findByIdAndUpdate({_id:req.params.id},user);
        res.redirect("/");


} catch (error) {
    res.json({status:400,message:err})
    
}
})


// delete an user
router.get('/delete/:id',async (req,res)=>{
    try{
        let id = req.params.id;
        await User.findByIdAndRemove(id);
        res.redirect("/");
    //    await User.findByIdAndRemove(id,(err,result)=>{
            // if(result.image!=''){
            //     try {
            //         fs.unlinkSync('./uploads/'+result.image);
            //     } catch (error) {
            //         console.log(error)
            //     }
            // }
            // if(err){
            //     res.json({message:err.message})
            // }else{
            //     req.session.message={
            //         type:'info',
            //         message:"Deleted !"
            //     }
            // }
        // })
    }
    catch(err){
        res.json({status:400,message:err})
    }
        
})

module.exports = router;

