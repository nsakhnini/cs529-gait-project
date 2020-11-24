var express = require('express');

var fs = require('fs');
var http = require('http');
var formidable = require('formidable');
var multer = require("multer");
var upload = multer({dest:"./public/images/uploads/"});
var fileName;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/uploadfile", function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    fs.readFile(files.savedWork.path, function (err,data) {
      if(err){
        res.status(404).send("error");
      }
      else{//Do more processing in the future
        res.send(data);
      }
    });
  });
});

module.exports = router;