var express = require('express');
var router = express.Router();
var User = require('../models/user');
const passport = require('passport');


// Dashboard Route
router.get('/dashboard',isValidUser, async function(req,res,next){
  User.findOne({_id:req.user._id}).then(result=>{
    return res.render("dashboard",{"user":result})
  }).catch(err=>{
    //return res.status(501).json(err);
    res.redirect("/login")
  })
});

// Settings Route
router.get('/settings',isValidUser,function(req,res,next){
  User.findOne({_id:req.user._id}).then(result=>{
    return res.render("settings",{"user":result})
  }).catch(err=>{
    //return res.status(501).json(err);
    res.redirect("/login")
  })
  //return res.status(200).json(req.user);
});

// Posting to Settings (Changing Name/Email)
router.post('/settings/public',isValidUser,function(req,res,next){
  User.update({_id:req.user._id},{$set:{name:req.body.name,email:req.body.email}}).exec().then(result=>{
    //return res.status(201).json(result);
    res.redirect("/users/dashboard")
  }).catch(err=>{
    //return res.status(501).json(err);
    res.redirect("/users/settings")
  })
});

// Posting to Settings (Changing Password)
router.post('/settings/password',isValidUser,function(req,res,next){
  User.findOne({_id:req.user._id},function (err,user){
    //return res.status(201).json(result);
    if(err){
      res.redirect("/login")
    }
    if(!user.isValid(req.body.password)){
      return res.render("settings",{"error": 'Incorrect password',"user":user})
    }
    if (req.body.pass1!==req.body.pass2){
      return res.render('settings',{"error":"Passwords dont match","user":user})
    }
    User.update({_id:user._id},{$set:{password:User.hashPassword(req.body.password)}}).exec().then(result=>{
      //return res.status(201).json(result);
      return res.redirect("/users/dashboard")
    }).catch(err=>{
      //return res.status(501).json(err);
      return res.render('settings',{"error":err,"user":user})
    })
  })
})


function isValidUser(req,res,next){
  if(req.isAuthenticated()){
    next()
  }
  else{
    console.log('Unauthorized request')
    res.redirect('/login')
  //return res.status(401).json({message:'Unauthorized Request'});
  }
}

module.exports = router;
