const express=require("express");
const router =express.Router();
const request=require('request');
const config=require("config");
const auth=require("../../middleware/auth")
const {check,validationResult}=require('express-validator')
const User=require("../../modals/User")
const Profile=require("../../modals/Profile");
const { response } = require("express");
 //@route GET api/profile/me
 //@desc Get current user Profile
 //@access Private
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

//@route POST api/profile
 //@desc Create or update a user Profile
 //@access Private
 router.post('/',[auth,
[
    check("status","Status is Required").not().isEmpty(),
    check("skills","Skills is Required").not().isEmpty()
]
],async (req,res)=>{
const errors=validationResult(req)
if(!errors.isEmpty())
{
    return res.status(400).json({errors:errors.array()})
}
const {company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,instagram,linkedin}=req.body
//Build profile object
const profileFields={}
profileFields.user=req.user.id;
if(company) profileFields.company=company;
if(website) profileFields.website=website;
if(location) profileFields.location=location;
if(status) profileFields.status=status;
if(bio) profileFields.bio=bio;
if(githubusername) profileFields.githubusername=githubusername; 
if(skills)
{
    profileFields.skills=skills.split(',').map(skill=>skill.trim());

}
//Build Social object
profileFields.social={}
if(youtube)profileFields.social.youtube=youtube
if(twitter)profileFields.social.twitter=twitter
if(facebook)profileFields.social.facebook=facebook
if(linkedin)profileFields.social.linkedin=linkedin
if(instagram)profileFields.social.instagram=instagram
try{
let profile=await Profile.findOne({user:req.user.id})

if(profile)
{
    profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});

    return res.json(profile)
}
    //Create
    profile=new Profile(profileFields)
    await profile.save();
    res.json(profile);

}

catch(err)
{
    console.error(err.message)
    res.status(500).send('Server error')
}
})

//@route POST api/profile
 //@desc Get all profile
 //@access Public

 router.get('/',async (req,res)=>{
try{
const profiles=await Profile.find().populate('user',['name','avatar']);
res.json(profiles);
}catch(err)
{
    console.log(err.message)
    res.status(500).send('Server error');
}
 });


 //@route Get api/profile/user/:user_id
 //@desc Get profile by userId
 //@access Public

 router.get('/user/:user_id',async (req,res)=>{
try{
const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);

if(!profile) return res.status(400).json({msg:'There is no profile for this user'});
res.json(profile);


}catch(err)
{
    console.log(err.message)
    if(err.kind=='ObjectId')
    {
        return res.status(400).json({msg:'Profile Not found'});
    }
    res.status(500).send('Server error');
}
 });

 //@route Delete
 //@desc Delete profile and User
 //@access Public

 router.delete('/',auth,async (req,res)=>{
    try{
        //Remove Profile
    await Profile.findOneAndRemove({user:req.user.id});
    
    //Remove User
    await User.findOneAndRemove({_id:req.user.id});
    res.json({msg:'User Deleted'})
    
    }catch(err)
    {
        console.log(err.message)
        
        res.status(500).send('Server error');
    }
     });

//@route PUT
//@desc Add profile Experience
//@access Public
router.put('/experience',[auth,[
    check('title',"Title is Requires").not().isEmpty(),
    check('company','Company is Required').not().isEmpty(),
    check('from','from is required').not().isEmpty()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body
    const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try{
     
        const profile=await Profile.findOne({user:req.user.id})
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile)
    }catch(err){
     console.error(err.message);
     res.status(500).send('Server Error');


    }
});
//@route DELETE api/profile/experience/:exp_id
//@desc Delete
//@access Public
router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try{
   const profile =await Profile.findOne({user:req.user.id})
    const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id)
   profile.experience.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
    
    }catch(err)
    {
        return res.status(500).send('Server Error');
    }
})


//@route PUT
//@desc Add profile Education
//@access Public
router.put('/education',[auth,[
    check('school',"School is Requires").not().isEmpty(),
    check('degree','Degree is Required').not().isEmpty(),
    check('fieldofstudy','Field of study is required').not().isEmpty()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body
    const newEdu={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try{
     
        const profile=await Profile.findOne({user:req.user.id})
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile)
    }catch(err){
     console.error(err.message);
     res.status(500).send('Server Error');


    }
});
//@route DELETE api/profile/education/:edu_id
//@desc Delete
//@access Public
router.delete('/education/:edu_id',auth,async(req,res)=>{
    try{
   const profile =await Profile.findOne({user:req.user.id})
    const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id)
   profile.education.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
    
    }catch(err)
    {
        return res.status(500).send('Server Error');
    }
})

//@route DELETE api/profile/github/:username
//@desc GET user repos
//@access Public
router.get('/github/:username',(req,res)=>{
    try{
const options={
    url:`https://api.github.com/users/${req.params.username}/repos?per_page=5 & 
    sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
    metthod:'GET',
    headers:{'user-agent':'node-js'}
};
request(options,(error,message,body)=>{
    if(error) console.log(error);
    if(response.statusCode!==200)
    {
        res.status(400).json({msg:'No Github Profile found'})
    }
    res.json(JSON.parse(body));
})
    }catch(err)
    {
        res.status(500).send('Server Error');

    }
})
module.exports=router;
