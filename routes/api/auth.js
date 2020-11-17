const express=require("express");
const router =express.Router();
const auth=require("../../middleware/auth") 
const User=require("../../modals/User")
//@route GET api/auth



 //@desc Test route
 //@access Public
router.get('/',auth,async (req,res)=>
{
    try{
   const user=await User.findById(req.user.id).select("-password");
   res.json(user);
    }

    catch(err)
    {
  console.log(err.message);
  res.status(500).send('Server Errror')
    }
}
)

module.exports=router;