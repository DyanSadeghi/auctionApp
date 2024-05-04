const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timeStamps = require("mongoose-timestamp");

const TimeAuction = new Schema({
	timeBound: { type: String, required: true },
	expiresIn: { type: Number, required: true, default: 0 },
});

const AuctionSchema = new Schema({
	basicPrice: { type: String, required: true },
	meterage: { type: String, required: true },
	address: { type: String, required: true },
	images: { type: [String], required: false, default: [] },
	timeAuction: { type: TimeAuction },
});

AuctionSchema.plugin(timeStamps);

const AuctonModel = mongoose.model("Auction", AuctionSchema);

module.exports = AuctonModel;
