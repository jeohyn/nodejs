const express = require('express');
const router = express.Router();
var multer  = require('multer')
const {Product}=require('../models/Product')
const { auth } = require("../middleware/auth");
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

router.post("/uploadProduct", auth, (req, res) => {
    //받아온 정보를 db에 저장
    const product=new Product(req.body)
    product.save((err)=>{
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({success:true})
    })
});

router.post("/products", (req, res) => {
    let limit=req.body.limit?parseInt(req.body.limit):100;
    let skip=req.body.skip?parseInt(req.body.skip):0;
    let findArgs={};

    for(let key in req.body.filters){
        //key는 continent나 price
        if(req.body.filters[key].length>0){
            if(key==="price"){
                //price라면 가격의 범위(array) 저장
                findArgs[key]={
                    //greater than(초과)
                    $gt:req.body.filters[key][0],
                    //less than equal(미만)
                    $lte:req.body.filters[key][1]
                }
            }
            else{
                //continent라면 id가 저장
                findArgs[key]=req.body.filters[key];
            }
        }
    }

    //product collection의 data 가져오기
    Product.find(findArgs)
    .populate("writer")
    .skip(skip)
    .limit(limit)
    .exec((err, productInfo)=>{
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({success:true, productInfo, postSize:productInfo.length})
    })
});


module.exports = router;
