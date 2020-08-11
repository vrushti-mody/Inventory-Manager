var express = require('express');
var router = express.Router();
var User = require('../models/user');
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Get register Page
router.get('/register',function(req,res,next){
  res.render('register')
})

//Post Request on Register Page
router.post('/register',function(req,res,next){
  if (req.body.password!==req.body.cpassword){
    return res.render('register',{"error":"Passwords dont match"})
  }
  else{
    database(req,res);
  }
  
})

// Save Details to database 
async function database(req,res){
  var user= new User({
    name:req.body.name,
    email:req.body.email,
    password: User.hashPassword(req.body.password),
    createdAt: Date.now()
  });
  try{
    doc=await user.save()
    return res.redirect('/login')
    //return res.status(201).json(doc);
  }
  catch(err){
    return res.render('register',{"error":"Error saving data! Please try again"})
    //return res.status(501).json(err);
  }
  
}

//Get Login Page
router.get('/login',function(req,res,next){
  res.render('login')
})

//Post Request on Login Page
router.post('/login',function(req,res,next){
  passport.authenticate('local', function(err,user,info){
    if (err){ return res.render('login',{"error":"Invalid email/password"});}
    if (!user){  return res.render('login',{"error":"Invalid email/password"})}
    req.login(user,function(err){
      if(err){ return res.status(501).json(err);}
      return res.redirect('/users/dashboard')
    });
  })(req,res,next);
});

router.get('/logout',isValidUser,function(req,res,next){
  req.logout();
  res.redirect('/')
  //return res.status(200).json({message:'Logout Successful'});
});

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
