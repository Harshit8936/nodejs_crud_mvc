const router = require('express').Router();
const User = require('../models/user');
const multer = require('multer');
const fs = require('fs');
const userController = require('../controllers/userController');

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



// Add new user
router.get("/add",(req,res)=>{
    res.render("add_user",{title:"Add User"})
})

// update an existing  user

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
    }
    catch(err){
        res.json({status:400,message:err})
    }
        
})

// get all users route
router.get('/',userController.allUsers);
// get singl user route
router.get("/edit/:id",userController.singleUser);

// about router
router.get('/about',userController.about);

// contact router
router.get('/contact',userController.contact);

module.exports = router;

