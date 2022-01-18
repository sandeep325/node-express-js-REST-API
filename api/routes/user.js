require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// ==================================REST API FOR USER SIGNUP START===================================================
router.post('/signup', (req, res, next) => {
    // res.send("hello user");
    // check if mail is exist
    User.find({ email: req.body.email })
        .exec()
        .then(getdocForEmail => {
            if (getdocForEmail.length > 0) {
                return res.status(409).json({ status: 409, message: "Email already exist try another." });
            } else {
                // hash password first then save data
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            error: err,
                        });

                    }
                    else {
                        // save data finally
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,

                        });
                        user.save().then(result => {
                            console.log(result);
                            res.status(201).json({
                                status: 201,
                                id: result._id,
                                message: "User created successfully...",
                                // data: {

                                // }
                            });
                        })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ status: 500, error: err });
                            });
                    }  //end if else for hash password

                })

            }  //end if else for check mail exist
        })
        .catch(err => { console.log(err); res.status(500).json({ status: 500, error: err }); });

});

// ==================================REST API FOR USER SIGNUP END===================================================






// ==================================REST API FOR USER LOGIN END===================================================


// ==================================REST API FOR USER LOGIN END===================================================

router.post("/userlogin", (req, res, next) => {
    // res.send("test");
    User.find({ email: req.body.email }).exec()
        .then(userdata => {
            // res.status(200).json(result);
            // for check user 
            if (userdata.length < 1) {
                return res.status(401).json({ status: 401, message: "Auth failed (No user exist)." });

            }

            // for checking hasing password
            bcrypt.compare(req.body.password, userdata[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ status: 401, message: "Auth failed ." });

                }

                if (result) {
                    // create JWT TOKEN  For Login user
                    const token = jwt.sign({
                        email: userdata[0].email,
                        userId: userdata[0]._id,
                    },process.env.JWT_KEY,
                        { expiresIn: "1h" }
                    );
                    // END JWT TOKEN 

                    return res.status(200).json({
                        status: 200,
                        message: "Auth successfull...",
                        token: token
                    });
                }

                res.status(401).json({ status: 401, message: "Auth failed (May be password encurrect)." });
            });  //bcrypt pass comare end


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, error: err });
        });

});



// ==================================REST API FOR USER DELETE START===================================================

router.delete('/deleteuser/:userID', (req, res, next) => {
    const id = req.params.userID;
    // res.send(id);  return false;
    User.deleteOne({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            if (result.deletedCount === 1) {
                res.status(200).json({
                    status: 200,
                    deletedCount: result.deletedCount,
                    message: 'User deleted successfully...',
                });

            }
            else {
                //   res.send("test"); return false;
                return res.status(200).json({
                    status: 204,
                    message: 'User Not found in database.',
                    deletedCount: result.deletedCount,
                });

            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, error: err });
        });


});

// ==================================REST API FOR USER DELETE END===================================================

module.exports = router;