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
  connection.query("select * from login", (err, result) => {
    if (err) throw err;
    res.render("loginpage", { data: result });
    //res.json(result);
  });
});

router.get("/loginpost", function (req, res, next) {
  const email = req.query.email;
  const password = req.query.password;

  // qauery to call authenticate_user(IN p_username VARCHAR(20), IN p_password VARCHAR(20), OUT p_user_type VARCHAR(20))
  const query = `CALL authenticate_user('${email}', '${password}', @user_type)`;

  console.log(query);
  connection.query(query, [email, password], function (err, results, fields) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to login user" });
    }
    // check if user_type is customer or restaurant and redirect accordingly
    connection.query("SELECT @user_type", function (err, results, fields) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to login user" });
      }
      console.log(results[0]["@user_type"]);
      if (results[0]["@user_type"] == "customer") {
        res.redirect("/viewTables/homePageRender");
      } else if (
        results[0]["@user_type"] == null ||
        results[0]["@user_type"] == "restaurant"
      ) {
        res.redirect("/viewTables/restaurantLandingPage");
      } else {
        res.redirect("/viewTables/homePageRender");
      }
    });
  });
});

router.get("/signupRestaurant", function (req, res, next) {
  console.log("Ye query hai" + req.query.email);
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
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        res.redirect("/viewTables/login");
      }
    }
  );
});

router.get("/signupCustomer", function (req, res, next) {
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
      console.log(
        `CALL customer_signup('${name}', '${username}', '${password}', '${email}', '${phone1}','${phone2}')`
      );

      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        res.redirect("/viewTables/login");
      }
    }
  );
});

// Create a get function to call CREATE PROCEDURE insert_menu_item7(IN res_id VARCHAR(20),IN item_id INT,IN item_name VARCHAR(20),IN item_type VARCHAR(20),IN item_price DECIMAL(10,2),IN item_desc VARCHAR(50),IN item_avail BOOLEAN,IN cuisine1 VARCHAR(20),IN cuisine2 VARCHAR(20),IN cuisine3 VARCHAR(20))
router.get("/addItem", function (req, res, next) {
  const res_id = "ever@gmail.com";
  const item_id = req.query.username;
  const item_name = req.query.itemname;
  const item_type = req.query.type;
  const item_price = req.query.price;
  const item_desc = req.query.description;
  const item_avail = "1";
  const cuisine1 = "american";
  const cuisine2 = "turkish";
  const cuisine3 = "indian";

  // call database procedure
  connection.query(
    `CALL insert_menu_item7('${res_id}', '${item_id}', '${item_name}', '${item_type}', '${item_price}', '${item_desc}', '${item_avail}', '${cuisine1}', '${cuisine2}', '${cuisine3}')`,

    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        res.redirect("/viewTables/addItemRender");
      }
    }
  );
});

// Create a get function to call CREATE PROCEDURE display_restaurants_in_pincode(IN pincode VARCHAR(20))
router.get("/getRestaurantDetail", function (req, res, next) {
  const pincode = req.query.location;

  // call database procedure
  connection.query(
    `CALL display_restaurants_in_pincode('${pincode}')`,
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        res.render("restaurantdisplay", { data: result[0] });
      }
    }
  );
});

// Create a get function to call CREATE PROCEDURE addReviewProcedure (IN p_cust_id VARCHAR(20),IN p_res_id VARCHAR(20),IN p_date DATE,IN p_overall_rating INT,IN p_title VARCHAR(20),IN p_description VARCHAR(20),OUT p_result INT)
router.get("/addReview", function (req, res, next) {
  const p_cust_id = req.query.customer_id;
  const p_res_id = req.query.restaurant_id;
  const p_date = "2023-05-15";
  const p_overall_rating = req.query.over;
  const p_title = "My Experience";
  const p_description = req.query.review;

  // call database procedure
  connection.query(
    `CALL addReviewProcedure ('${p_cust_id}', '${p_res_id}', '${p_date}', '${p_overall_rating}', '${p_title}', '${p_description}', @p_result)`,
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        res.redirect("/viewTables/reviewRender");
      }
    }
  );
});

// Create  a get function to call bookTableProcedure (IN p_res_id VARCHAR(20), IN p_timeslot VARCHAR(20), IN p_cust_id VARCHAR(20), IN p_num_tables INT, OUT p_result INT)
router.get("/bookTable", function (req, res, next) {
  const p_res_id = req.query.restaurant_id;
  const p_timeslot = req.query.time;
  const p_cust_id = req.query.customer_id;
  const p_num_tables = req.query.tables;

  // call database procedure
  connection.query(
    `CALL bookTableProcedure ('${p_res_id}', '${p_timeslot}', '${p_cust_id}', '${p_num_tables}', @p_result)`,
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        res.redirect("/viewTables/booktablerender");
      }
    }
  );
});


router.get("/homePageRender", function (req, res, next) {
  res.render("customerlogin");
});

router.get("/", function (req, res, next) {
  res.render("landingpage");
});

router.get("/signupLanding", function (req, res, next) {
  res.render("signuplanding");
});
router.get("/signupLanding", function (req, res, next) {
  res.render("signuplanding");
});
router.get("/customerregistrationrender", function (req, res, next) {
  res.render("regcustomer");
});

router.get("/restaurantregistrationrender", function (req, res, next) {
  res.render("regrestaurant");
});
router.get("/aboutUsrender", function (req, res, next) {
  res.render("aboutus");
});
router.get("/booktablerender", function (req, res, next) {
  res.render("booktable");
});
router.get("/giveReviewrender", function (req, res, next) {
  res.render("review");
});

router.get("/restaurantLandingPage", function (req, res, next) {
  res.render("restaurantlogin");
});

// Render add item page
router.get("/addItemRender", function (req, res, next) {
  res.render("addItem");
});

router.get("/restaurantSearchRender", function (req, res, next) {
  res.render("restaurantdisplay");
});
router.get("/reviewRender", function (req, res, next) {
  res.render("review");
});
router.get("/bookTableRender", function (req, res, next) {
  res.render("booktable");
});

module.exports = router;
