const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const multer = require("multer");
const path=require("path");
var ffmpeg=require("fluent-ffmpeg"); //비디오 썸네일 생성 시 필요

const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

let storage=multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, "uploads/");
    },
    filename:(req, file, callback)=>{
        callback(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req, file, callback)=>{
        const ext=path.extname(file.originalname)
        if(ext !== ".mp4"){
            return callback(res.status(400).end("only mp4 is allowed"), false);
        }
        callback(null, true)
    }
});

const upload=multer({storage:storage}).single("file");


//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res)=>{
    //비디오를 서버에 저장
    upload(req, res, err=>{
        if(err){
            return res.json({success:false, err})
        }
        return res.json({success:true, url: res.req.file.path, fileName: res.req.file.filename})
    });

});

router.post('/thumbnail', (req, res)=>{

    let filePath=""
    let fileDuration=""

    //비디오 정보 가져오기(비디오 길이)
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration=metadata.format.duration
    })

    //썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function(filenames){ //썸네일의 파일 이름과 경로 설정
        console.log('will generate '+filenames.join('. '))
        console.log(filenames)
        filePath="uploads/thumbnails/"+filenames[0]
    })
    .on('end', function(){ //썸네일 생성 후 실행되는 부분
        console.log('Screenshots taken');
        return res.json({success:true, url:filePath, fileDuration:fileDuration})
    })
    .on('error', function(err){
        console.error(err);
        return res.json({success:false, err});
    })
    .screenshots({
         //320x240 크기로 3개의 썸네일을 찍어 uploads/thumbnails 안에
         //thumbnail-(익스텐션을 제외한 파일의 오리지널 이름).png로 저장
        count:3,
        folder:'uploads/thumbnails',
        size:'320x240',
        filename:'thumbnail-%b.png'
    })
});

router.post('/uploadVideo', (req, res)=>{
    
    const video =new Video(req.body)
    //비디오 정보를 db에 저장
    video.save((err, doc)=>{
        if(err) return res.json({success:false, err})
        res.status(200).json({success:true})
    })
});



router.get('/getVideos', (req, res)=>{
    //비디오 정보를 db에서 가져와서 클라이언트에게 전송
    Video.find()
        .populate('writer') //populate을 해야지 Video의 ref인 User에서 정보 가져올수있음. populate안하면 writer의 id만 가져올 수 있음.
        .exec((err, videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true, videos})
        })
});

router.post('/getVideoDetail', (req, res)=>{
    Video.findOne({"_id":req.body.videoId})
    .populate('writer')
    .exec((err, videoDetail)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true, videoDetail})
    })
});


router.post('/getSubscriptionVideos', (req, res)=>{
    //유저 아이디를 가지고 구독하는 사람들(userTo)을 찾음
    Subscriber.find({userFrom:req.body.userFrom})
    .exec((err, subscriberInfo)=>{
        if(err) return res.status(400).send(err)
        let subscribedUser=[];
        subscriberInfo.map((subscriber, index)=>{
            subscribedUser.push(subscriber.userTo);
        })

        //userTo의 비디오를 가지고옴
        Video.find({writer:{$in:subscribedUser}})
        .populate('writer')
        .exec((err, videos)=>{
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true, videos})
        })
    })

});


module.exports = router;
