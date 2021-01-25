const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const videoSchema = mongoose.Schema({
   writer:{
       //writer의 id
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'//User에 가서 id로 정보 가져올 수 있음
   },
   title:{
       type:String,
       maxlength:50
   },
   description:{
       type:String
   },
   privacy:{
       type:Number
   },
   filePath:{
       type:String
   },
   category:{
       type:String
   },
   views:{
       type:Number,
       default:0
   },
   duration:{
       type:String
   },
   thumbnail:{
       type:String
   }
}, {timestamps:true}) //만든 date, update date도 표시


const Video=mongoose.model('Video', videoSchema)

module.exports = { Video }