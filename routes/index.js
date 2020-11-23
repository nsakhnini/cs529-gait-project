var express = require('express');

var fs = require('fs');
var http = require('http');
var formidable = require('formidable');
var multer = require("multer");
var upload = multer({dest:"./public/images/uploads/"});

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/fileupload", function(req, res, next){
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(files);
    var oldpath = files.savedWork.path;
    var newpath = './file_processing/' + files.savedWork.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.end();
    });
  });
  res.redirect("/");
});

module.exports = router;
