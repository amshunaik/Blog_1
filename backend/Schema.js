const mongoose=require('mongoose');
const data=new mongoose.Schema({
    title:String,
    content:String,
    summary:String
})

const model=mongoose.model("Posts",data);
module.exports =model;