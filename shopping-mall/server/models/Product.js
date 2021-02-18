const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    continent: {
        type: Number,
        default: 1
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {timestamps:true})

//검색시 검색 범위를 지정. weights를 통해 검색 시 우선순위 부여. 
//여기서 description의 weight는 1
productSchema.index({
    title:'text',
    description:'text'
},{
    weights:{
        title:5
    }
})


const Product = mongoose.model('Product', productSchema);

module.exports = { Product }