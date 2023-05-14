var express = require("express");
var router = express.Router();
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  port: 3306,
  database: "new_chew_review",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected!");
});

/* GET home page. */
router.get("/login", function (req, res, next) {
  connection.query(
    "select * from login",
    (err, result) => {
      if (err) throw err;
        res.render('loginpage',{data:result})
        //res.json(result);
   
    }
  );
});


router.get('/loginpost', function(req, res, next) {
  const email = req.query.email;
  const password = req.query.password;

  

  const query = 'CALL authenticate_user(?, ?, @user_type)';
  console.log(query);
  connection.query(query, [email, password], function(err, results, fields) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to login user' });
    }
    if(results['affectedRows']==1){
      //console.log("Mai ya ha hu "+res.statusCode);
      res.redirect('/viewTables/homePageRender');
    }
    else {
      console.log(result);
      res.redirect('/viewTables/login');
   // console.log(results);
    }
    
  });
});



router.get('/signupRestaurant', function(req, res, next) {
  console.log("Ye query hai"+req.query.email);
  const username = req.query.username;
  const email = req.query.email;
  const password = req.query.password;
  const timings = req.query.timings;
  const street = req.query.street;
  const city = req.query.city;
  const pincode = req.query.pincode;
  const phone = req.query.phone;

  // call database procedure
  connection.query(
    `CALL restaurant_signup('${username}', '${email}', '${password}', '${timings}', '${street}', '${city}', '${pincode}', '${phone}', null)`,
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } 
        else {
          console.log(result);
          res.redirect('/viewTables/login'); 
        }
    }
  ); 
});


router.get('/signupCustomer', function(req, res, next) {
  const name = req.query.name;
  const username = req.query.username;
  const password = req.query.password;
  const email = req.query.email;
  const phone1 = req.query.number1;
  const phone2 = req.query.number2;

  // call database procedure
  connection.query(
    `CALL customer_signup('${name}', '${username}', '${password}', '${email}', '${phone1}','${phone2}')`,
    (err, result) => {
    console.log(`CALL customer_signup('${name}', '${username}', '${password}', '${email}', '${phone1}','${phone2}')`);

      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log(result);
        res.redirect('/viewTables/login'); 
      }
    }
  );
});


router.get('/homePageRender',function(req,res,next){
  res.render('customerlogin');
})
router.get('/hRender',function(req,res,next){
  res.render('customerlogin');
})

router.get('/',function(req,res,next){
  res.render('landingpage');
})

router.get('/signupLanding',function(req,res,next){
  res.render('signuplanding');
})
router.get('/signupLanding',function(req,res,next){
  res.render('signuplanding');
})
router.get('/customerregistrationrender',function(req,res,next){
  res.render('regcustomer');
})

router.get('/restaurantregistrationrender',function(req,res,next){
  res.render('regrestaurant');
})
router.get('/aboutUsrender',function(req,res,next){
  res.render('aboutus');
})
router.get('/booktablerender',function(req,res,next){
  res.render('booktable');
})
router.get('/giveReviewrender',function(req,res,next){
  res.render('review');
})
module.exports = router;



