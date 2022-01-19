const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const product = require("../models/product");
const Product = require("../models/product");
const checkUserAuth = require("../middleware/Auth");

// ===========================this for images upload=============================================


const multer = require("multer");
const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const storage = multer.diskStorage({

    destination: function (req, file, cb) { cb(null, './product_images/'); },
    filename: function (req, file, cb) { cb(null, new Date().toISOString() + 'product' + file.originalname); }
});
// const upload = multer({dest:'product_images/'});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});


// ===========================this for images upload  end=============================================






// ===========================================PRODUCT  ALL Listing REST-API  START=========================================================================
router.get("/", checkUserAuth, upload.none(),  (req, res, next) => {

    Product.find().select("name price _id productImage").sort({ _id: -1 }).exec().then(docs => {
        //    console.log(doc);
        res.status(200).json({
            countproduct: docs.length,
            status: 200,
            products: docs.map(data => {
                return {
                    _id: data._id,
                    name: data.name,
                    price: data.price,
                    productImage: data.productImage,
                    request: {
                        type: 'GET',
                        url: `http://localhost:8080/products/${data._id}`
                    }
                }
            })
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });


});

// ===========================================PRODUCT  ALL Listing REST-API  END=========================================================================




// ===========================================PRODUCT  DETAIL BYID RESTAPI  START=========================================================================

router.get("/:productId", checkUserAuth, upload.none(), (req, res, next) => {
    const id = req.params.productId;
    if (id) {

        Product.findById(id).select("name price _id ").exec().then(dat => {
            if (dat) {
                // console.log('data from database',dat);
                res.status(200).json({
                    countproduct: dat.length,
                    status: 200,
                    message: `Product get by id :${id}`,
                    products: {
                        _id: dat._id,
                        name: dat.name,
                        price: dat.price,
                        productImage: dat.productImage,
                        request: {
                            type: 'GET',
                            url: `http://localhost:8080/products`
                        }
                    }
                });

            } else {

                res.status(404).json({ status:404,message: `No data found for id :${id}` });

            }

        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });

        });

    }

});
// ===========================================PRODUCT  DETAIL BYID REST-API  END=========================================================================




// ===========================================PRODUCT ADD RESTAPI  START=========================================================================

router.post("/addproducts", checkUserAuth, upload.none(),  (req, res, next) => {
    // const product =  req.body;
    // console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,

        // productImage: req.file.path,
    });
    product.save().then(result => {
        res.status(201).json({
            message: 'Product successfully Added...',
            status: 200,
            product: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: `http://localhost:8080/products/${result._id}`
                }
            }
        });

    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });

        });

});
// ===========================================PRODUCT ADD REST-API END =========================================================================


// ===========================================PRODUCT  DELETE REST-API  START=========================================================================

router.delete("/delete-products/:ProductId", checkUserAuth, upload.none(),  (req, res, next) => {
    //    const id = req.body.id;
    const id = req.params.ProductId;
    //    res.status(200).json({id:id}); return false;
    //    res.send(id); return false;
    Product.deleteOne({ _id: id }).exec().then(dat => {
        console.log(dat);
        if (dat.deletedCount === 1) {
            res.status(200).json({
                status: 200,
                deletedCount: dat.deletedCount,
                message: 'Product deleted successfully...',
            });

        }
        else {
           return res.status(200).json({
                status: 204,
                deletedCount: dat.deletedCount,
                message: 'Product Not Found on db.',
            });

        }
        
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    // res.status(200).json({
    //     'message':'product list for  DELETE product add api.'
    // });
});

// ===========================================PRODUCT  DELETE REST-API  END=========================================================================



// ===========================================PRODUCT  UPDATE REST-API  END=========================================================================
router.put("/update-product/:productId",checkUserAuth, upload.none(),  (req, res, next) => {

    const id = req.params.productId;
    // res.status(200).json(req.body); return false;
    const productU = {};
    for (const prodct of req.body) {

        productU[prodct.propName] = prodct.value;

    }
    Product.updateOne({ _id: id }, { $set: productU })
        .exec()
        .then(result => {
            if (result.acknowledged == true && result.modifiedCount == 1) {
                // console.log(result);

                res.status(200).json({
                    status: 200,
                    modifiedCount: result.modifiedCount,
                    message: 'Product updated successfully...',
                    products: {
                        _id: id,
                        request: {
                            type: 'GET',
                            url: `http://localhost:8080/products/${id}`
                        }
                    },
                });

            } else {
                console.log(result);
                res.status(200).json({
                    status: 204,
                    modifiedCount: result.modifiedCount,
                    message: 'Product Could not update...',
                    products: {
                        _id: id,
                        request: {
                            type: 'GET',
                            url: `http://localhost:8080/products/${id}`
                        }
                    },
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    // res.status(200).json({productU});
});
// ===========================================PRODUCT  UPDATE REST-API  END=========================================================================

module.exports = router;
