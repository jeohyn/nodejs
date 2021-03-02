const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const {Product} = require("../models/Product");
const { auth } = require("../middleware/auth");
const {Payment} = require("../models/Payment");
const async=require('async')

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history:req.user.history,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    //user collection에서 해당 유저 정보 가져오기
    //middleware인 auth에 의해 req에 user정보가 저장됨
    User.findOne({_id:req.user._id},
        (err, userInfo)=>{
            let duplicate=false;
            //cart에 넣으려하는 상품이 이미 들어있는지 확인
            userInfo.cart.forEach((item)=>{
                if(item.id===req.body.productId){
                    duplicate=true;
                }
            })
            //있다면
        if(duplicate){
            User.findOneAndUpdate(
                {
                _id:req.user._id, "cart.id":req.body.productId
                },
                {$inc:{"cart.$.quantity":1}},
                {new : true},//update된 정보를 적용시킨 후 다음 줄 실행
                (err, userInfo)=>{
                    if(err) return res.status(400).json({success:false, err})
                    return res.status(200).send(userInfo.cart)
                }
            )
        }
        else{//없다면
            User.findOneAndUpdate(
                {_id:req.user._id},
                {
                    $push:{
                        cart:{
                            id:req.body.productId,
                            quantity:1,
                            date:Date.now()
                        }
                    }
                },
                {new :true},
                (err, userInfo)=>{
                    if(err) return res.status(400).json({success:false, err})
                    return res.status(200).send(userInfo.cart)
                }
            )
        }
        
    })
        
});

router.get("/removeFromCart", auth, (req, res) => {
    //user의 cart에서 상품 삭제
    User.findOneAndUpdate({_id:req.user._id},
        {
            "$pull":
                {"cart":{"id":req.query.id}}   
        },
        {new:true},//product collection에서 cartDetail 다시 가져오게함(갱신)
        (err, userInfo)=>{
            let cart=userInfo.cart
            let array=cart.map(item=>{
                return item.id
            })
            Product.find({_id:{$in : array}})
            .populate('writer')
            .exec((err, productInfo)=>{
                //productInfo:product collection의 정보
                //cart: user collection에 저장된 cart의 product 관련 정보
                return res.status(200).json({productInfo, cart})
            })
        }
    )
});

router.post("/successBuy", auth, (req, res) => {
    
    let history=[];
    let transactionData={};

    //user collection의 history field안에 구매 정보 저장
    req.body.cartDetail.forEach((item)=>{
        history.push({
            dateOfPurchase:Date.now(),
            name:item.title,
            id:item._id,
            price:item.price,
            quantity:item.quantity,
            paymentId:req.body.paymentData.paymentId
        })
    })

    //payment collection에 더 자세한 결제 정보 저장
    //결제하다가 cancel했는지 여부도 저장
    transactionData.user={
        id:req.user._id,
        name:req.user.name,
        email:req.user.email
    }
    transactionData.data=req.body.paymentData;
    transactionData.product=history;

    //history update
    User.findOneAndUpdate({_id:req.user._id},
        {$push:{history:history}, $set:{cart:[]}},
        {new:true},
        (err, user)=>{
            if(err) return res.json({success:false, err})
            //add transaction info
            const payment=new Payment(transactionData);
            payment.save((err, doc)=>{
                if(err) return res.json({success:false, err})

                //상품당 몇개를 샀는지 저장(save the quantity of sold products)
                let products=[];
                doc.product.forEach(item=>{
                    products.push({id:item.id, quantity:item.quantity})
                })
                //product collection의 sold field 업데이트
                async.eachSeries(products, (item, callback)=>{
                    Product.update(
                        {_id:item.id},
                        {$inc:{
                            "sold":item.quantity
                        }},
                        {new :false},
                        callback
                    )
                },(err)=>{
                    if(err) return res.status(400).json({success:false, err})
                    return res.status(200).json(
                        {success:true,
                        cart:user.cart,
                        cartDetail:[]
                    })
                })
            });
        })
});

module.exports = router;
