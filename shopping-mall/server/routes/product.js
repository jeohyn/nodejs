const express = require('express');
const router = express.Router();
var multer  = require('multer')
const {Product}=require('../models/Product')

//=================================
//             product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/')
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
  var upload = multer({ storage: storage }).single('file')

router.post("/image", (req, res) => {
    //가져온 이미지 저장
    upload(req, res, err=>{
        if(err){
            return req.json({success:false, err})
        }
        return res.json({success:true, filePath:res.req.file.path, fileName:res.req.file.filename})
    })
});

router.post("/", (req, res) => {
    //받아온 정보를 db에 저장
    const product=new Product(req.body)
    product.save((err)=>{
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({success:true})
    })
});


module.exports = router;
