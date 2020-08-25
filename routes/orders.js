var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Item = require('../models/item');
var Order = require('../models/order');
const { listenerCount } = require('../app');
var async = require("async");
//Add Order Route
router.get('/addorder',isValidUser, async function(req,res,next){
    User.findOne({_id:req.user._id}).then(result=>{
      Item.find({userid:result._id}).then(items=>{
        return res.render("addorder",{"user":result,"items":items})
      }).catch(err=>{
        //return res.status(501).json(err);
        res.redirect("/users/dashboard")
      })
      
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
  });

  router.post('/addorder', isValidUser, async (req, res) => {
    try {
      console.log(req.body.quantity)
      const quantityItemMap = {};
      if (Array.isArray(req.body.item)){
        
      //   async.forEachOf(req.body.item, (items, idx, callback) => {
      //     quantityItemMap[items] = req.body.quantity[idx];
      //     console.log('Here')
      //      Item.update({
      //     itemname:items,
      //     userid:req.user._id
      //   },
      //   { $inc: { quantity:req.body.quantity[idx]  }}
      //   ).then(result=>{
      //     callback()
      //   })
          
      // }, err => {
      //     if (err) console.error(err.message);
          
      // });


        for ( i =0; i<req.body.item.length;i++){
          quantityItemMap[req.body.item[i]] = req.body.quantity[i];
          await Item.update({
            itemname:req.body.item[i],
            userid:req.user._id
          },
          { $inc: { quantity: -(parseInt(req.body.quantity[i])) }}
          )
        }
      //  req.body.item.forEach(async (items, idx) => {
      //    console.log('Here')
      //   quantityItemMap[items] = req.body.quantity[idx];
      //   qty= parseInt(req.body.quantity[idx]);
      //     await Item.update({
      //     itemname:items,
      //     userid:req.user._id
      //   },
      //   { $inc: { quantity: qty }}
      //   )
      // });
      
      }
      else{
        quantityItemMap[req.body.item] = req.body.quantity;
         await Item.update({
          itemname:req.body.item,
          userid:req.user._id
        },
        { $inc: { quantity: -(req.body.quantity) }}
        )
      }
      
      const itemDocs = await Item.find({
        itemname: {
          $in: req.body.item,
        },
        userid:req.user._id
        
      });
      
      const bills = itemDocs.map(doc => ({
        itemname: doc.itemname,
        itemprice: doc.price,
        quantity: quantityItemMap[doc.itemname],
        subtotal: quantityItemMap[doc.itemname] * doc.price
      }));
    
      const total = bills.reduce((t, item) => t + item.subtotal, 0);
    
      await Order.create({
        userid: req.user._id,
        total: total,
        items: bills,
        name: req.body.name,
        date: Date.now()
      });
    
      return res.redirect('/users/dashboard');
    } catch (e) {
      console.log(e.message)
      return res.status(500).json({message:e.message});
    }
  });

// All Orders
// Add Item Route


router.get('/allorders',isValidUser, async function(req,res,next){
  User.findOne({_id:req.user._id}).then(result=>{
    Order.find({userid:result._id}).then(orders=>{
      console.log(orders)
      return res.render("allorders",{"user":result,"orders":orders})
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
    
  }).catch(err=>{
    //return res.status(501).json(err);
    res.redirect("/users/dashboard")
  })
});

router.get('/vieworder/:id',isValidUser, async function(req,res,next){
  id=req.params.id;
  User.findOne({_id:req.user._id}).then(result=>{
    Order.findOne({_id:id}).then(order=>{

      return res.render("bill",{"user":result,"order":order})
    }).catch(err=>{
      //return res.status(501).json(err);
      console.log(err.message)
      // res.redirect("/users/dashboard")
    })
    
  }).catch(err=>{
    //return res.status(501).json(err);
    console.log(err.message)
    // res.redirect("/users/dashboard")
  })
});


router.post('/deleteorder/:id',isValidUser, async function(req,res,next){
  id=req.params.id;
  Order.deleteOne({_id:id}).then(order=>{
    return res.redirect('/orders/allorders')
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
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