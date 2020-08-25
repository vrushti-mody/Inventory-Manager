var express = require('express');
var router = express.Router();
var fpgrowth = require("node-fpgrowth");
var Order = require('../models/order');
var User = require('../models/user');

console.log(`Executing FPGrowth...`);

router.get('/shelving',isValidUser,  async function(req,res,next){
    
    const orders = await Order.find({userid:req.user._id}).select('items');  
    const user = await User.findOne({_id:req.user._id})    // list of orders which will have a list of item objects
    let nameList = [];
    await orders.map((order) => {
        let listOfItems = order.items;
        let names = [];
        listOfItems.map((item) => {
            names.push(item.itemname);
        });
        nameList.push(names);
        names=[]
    });
    var fpgrow = new fpgrowth.FPGrowth(.4);
    let transactions = nameList
    console.log(transactions)
// Execute FPGrowth with a minimum support of 40%.



// Execute FPGrowth on a given set of transactions.
fpgrow.exec(transactions)
    .then(function (itemsets) {
      // Returns an array representing the frequent itemsets.
      console.log(itemsets)
      res.render('reshelving',{"itemsets":itemsets,"user":user})
      console.log(`Finished executing FPGrowth. ${itemsets.length} frequent itemset(s) were found.`);
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