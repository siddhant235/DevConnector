const express=require("express");
const router =express.Router();
const auth=require("../../middleware/auth")
const User=require("../../modals/User")
const Profile=require("../../modals/Profile")
 //@route GET api/users
 //@desc Test route
 //@access Public
router.get('/me',auth,async (req,res)=>
{
    try{
     const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
if(!profile)
{
    return res.status(400).json({msg:"There is no Profile"})
}
res.json(profile)
    }
    catch(err){
          console.error(err.message)
          res.status(500).send("Internal Server Error");
    }
}

)

module.exports=router;