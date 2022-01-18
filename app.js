const express  = require("express");
const morgan = require("morgan");
const app = express();
const productRoutes =  require("./api/routes/products");
const orderRoutes =  require("./api/routes/orders");
const bodyParser =  require("body-parser");

const mongoose = require("mongoose");
// mongodb connection
mongoose.connect('mongodb://localhost:27017/nodeapi', () => { console.log("[+] Succesfully connected to database."); });


app.use(morgan("dev"));
app.use('/product_images',express.static("product_images"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
      res.header("Access-Control-Allow-Origin","*");
      res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-with, Content-Type,Accept,Authorization"
      );
      if(req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
             return res.status(200).json({});
      }
      next();
});

app.use("/products",productRoutes);
app.use("/orders",orderRoutes);


app.use((req,res,next)=>{
      const error = new Error('Not Found');
      error.status=404;
      next(error);
});
app.use((error,req,res,next)=>{
      res.status(error.status||500);
      res.json({
            error :{
                  message: error.message
            }
      });
});
// app.get("/", (req,res)=>{
//     //  console.log("expree...");
//     res.send("express code");
//       });


port = process.env.PORT || 8080;      
      app.listen(port,()=>{ console.log(`the running server port is:${port}`);});