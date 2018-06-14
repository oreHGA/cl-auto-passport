const express = require("express");
const multipart = require("connect-multiparty");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Multiparty middleware
const multipartMiddleware = multipart();

cloudinary.config({
  cloud_name: "CLOUD_NAME",
  api_key: "API_KEY",
  api_secret: "API_SECRET"
});


app.post("/upload", multipartMiddleware, function(req, res) {
  cloudinary.uploader.upload(
    req.files.image.path,
    {
      transformation: [
        { 
            width: req.body.width, 
            height: req.body.height,
            gravity: "face",
            crop: "thumb"
        }
      ],
      colors: true
    },
    function(err, image) {
        if(err){
            return res.json({ error : "Sorry and error occured processing your image"})
        }
        // fetch predominant colors
      let predominant_color = image.predominant.google[0][0];
      let predominant_color2 = image.predominant.google[1][0];
      if( predominant_color == 'white' && predominant_color == 'white' ){
        return res.json({ url: image.url });
      }else{
        return res.json({
          error: "Sorry, your image should have a predominantly white background"
        });  
      }
    }
  );
});

app.listen(3128);
console.log("Listening on localhost:3128");
