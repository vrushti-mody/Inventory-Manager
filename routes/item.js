var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Item = require('../models/item');

// Add Item Route
router.get('/additem',isValidUser, async function(req,res,next){
  User.findOne({_id:req.user._id}).then(result=>{
    return res.render("additem",{"user":result})
  }).catch(err=>{
    //return res.status(501).json(err);
    res.redirect("/users/dashboard")
  })
});

// Add Item to Database 
router.post('/additem',isValidUser, async function(req,res,next){
  addItemToDatabase(req,res);
});

async function addItemToDatabase(req,res){
  var item= new Item({
    itemname:req.body.itemname,
    price: req.body.price,
    quantity: req.body.quantity,
    userid:req.body.userid
  });
  try{
    item1=await item.save()
    User.findOne({_id:req.body.userid},function (err,user){
      if(err){ return res.redirect('/users/dashboard') }
      if(!user){
          return res.redirect('/users/dashboard')
      }
      return res.render('additem',{"error":"Item added succssfully!","user":user})
  }) 
    //return res.status(201).json(doc);
  }
  catch(error){
    User.findOne({_id:req.body.id},function (err,user){
      if(err){ return res.redirect('/users/dashboard') }
      if(!user){
          return res.redirect('/users/dashboard')
      }
      return res.render('additem',{"error":error,"user":user})
    })
  }  
}

// Add Item Route
router.get('/allitems',isValidUser, async function(req,res,next){
  User.findOne({_id:req.user._id}).then(user=>{
    Item.find({userid:user._id}).then(items=>{
      return res.render('allitems',{"items":items,"user":user})
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
  }).catch(err=>{
    //return res.status(501).json(err);
    res.redirect("/users/dashboard")
  })
});

// Edit Item Route
router.get('/edititem/:id',isValidUser, async function(req,res,next){
  id=req.params.id;
  User.findOne({_id:req.user._id}).then(user=>{
    Item.findOne({_id:id}).then(item=>{
      return res.render('edititem',{"item":item,"user":user})
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
  }).catch(err=>{
    //return res.status(501).json(err);
    res.redirect("/users/dashboard")
  })
});

// Update an Item 
router.post('/edititem/:id',isValidUser, async function(req,res,next){
  id=req.params.id;
  itemname=req.body.itemname;
  price=req.body.price;
  quantity=req.body.quantity;
  Item.update({_id:id},{$set:{itemname:itemname,price:price,quantity:quantity}}).then(item=>{
    return res.redirect('/items/edititem/'+id)
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
});

//Delete an Item
router.post('/deleteitem/:id',isValidUser, async function(req,res,next){
  id=req.params.id;
  Item.deleteOne({_id:id}).then(item=>{
    return res.redirect('/items/allitems')
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
});

// // Settings Route
// router.get('/settings',isValidUser,function(req,res,next){
//   User.findOne({_id:req.user._id}).then(result=>{
//     return res.render("settings",{"user":result})
//   }).catch(err=>{
//     //return res.status(501).json(err);
//     res.redirect("/login")
//   })
//   //return res.status(200).json(req.user);
// });

// // Posting to Settings (Changing Name/Email)
// router.post('/settings/public',isValidUser,function(req,res,next){
//   User.update({_id:req.user._id},{$set:{name:req.body.name,email:req.body.email}}).exec().then(result=>{
//     //return res.status(201).json(result);
//     res.redirect("/users/dashboard")
//   }).catch(err=>{
//     //return res.status(501).json(err);
//     res.redirect("/users/settings")
//   })
// });

// // Posting to Settings (Changing Password)
// router.post('/settings/password',isValidUser,function(req,res,next){
//   User.findOne({_id:req.user._id},function (err,user){
//     //return res.status(201).json(result);
//     if(err){
//       res.redirect("/login")
//     }
//     if(!user.isValid(req.body.password)){
//       return res.render("settings",{"error": 'Incorrect password',"user":user})
//     }
//     if (req.body.pass1!==req.body.pass2){
//       return res.render('settings',{"error":"Passwords dont match","user":user})
//     }
//     User.update({_id:user._id},{$set:{password:User.hashPassword(req.body.password)}}).exec().then(result=>{
//       //return res.status(201).json(result);
//       return res.redirect("/users/dashboard")
//     }).catch(err=>{
//       //return res.status(501).json(err);
//       return res.render('settings',{"error":err,"user":user})
//     })
//   })
// })


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
