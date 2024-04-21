const mongoose = require("mongoose")
const Schema = mongoose.Schema
const timeStamps = require("mongoose-timestamp")


const AuctionPoolSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref:"User"},
    auction:{type:Schema.Types.ObjectId, ref:"Auction"},
    totalPrice:{type:String,required:true},
    paymentMethod:[{date:String,price:Number}]


})

AuctionPoolSchema.plugin(timeStamps);

const PoolModel = mongoose.model("Pool",AuctionPoolSchema)

module.exports = PoolModel