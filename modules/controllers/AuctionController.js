const Controller = require(`${config.path.controller}/Controller`);

const { body } = require("express-validator");

module.exports = new (class AuctionController extends Controller {
	async index(req, res) {
		try {
			const auctions = await this.model.Auction.find();
			if (auctions) {
				return res.json(auctions);
			} else {
				return res.json([]);
			}
		} catch (error) {
			console.log(error);
		}
	}
	async single(req, res) {
		try {
			const auction = await this.model.Auction.findById(req.params.id);
			if (auction) {
				return res.json(auction);
			} else {
				return res.json({ message: "Auction not found" });
			}
		} catch (error) {
			console.log(error);
		}
	}
})();
