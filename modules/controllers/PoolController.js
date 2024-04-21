const Controller = require(`${config.path.controller}/controller`);
const jwt = require("jsonwebtoken");
const util = require("util");
const jwtVerify = util.promisify(jwt.verify);
const User = require(`${config.path.model}/User`);
const Auction = require(`${config.path.model}/Auction`);
const PoolModel = require(`${config.path.model}/auction-pool`);


const { body } = require("express-validator");

module.exports = new (class PoolController extends Controller {
	async submit(req, res) {
		try {
			let token = req.body.token || req.query.token || req.headers["x-access-token"];
			let user_id;

			if (token) {
				const decode = await jwtVerify(token, config.JWT_SECRET);
				if (!decode) {
					return res.json({ success: false, data: "failed to authenticate token" });
				}
				const user = await this.model.User.findById(decode.user_id);
				if (!user) {
					return res.json({ success: false, data: "User not found" });
				}
				user.token = token;
				req.user = user;
				user_id = user.id;
			}

			let auctionId = req.body.auction;
			let paymentMethod = req.body.paymentMethod;
			let totalPrice = req.body.totalPrice;
			const auctionResult = await this.model.Auction.findById(auctionId);
			if (auctionResult) {
				let prices = 0;

				paymentMethod.map((p) => {
					prices += p.price;
				});

				if (Number(totalPrice) !== prices) {
					return res.json({ message: "your payment is invalid" });
				}

				let newAuctionPool = await new PoolModel({
					user: user_id,
					auction: auctionId,
					paymentMethod,
					totalPrice,
				});
				newAuctionPool.save();
				return res.json("auction pool created");
			} else {
				return res.json("auction not found");
			}
		} catch (error) {
			console.log(error);
		}
	}
	// async submit(req, res) {
	// 	try {
	// 		let token = req.body.token || req.query.token || req.headers["x-access-token"];
	// 		let user_id;

	// 		if (token) {
	// 			const decode = await jwtVerify(token, config.JWT_SECRET);
	// 			if (!decode) {
	// 				return res.json({ success: false, data: "failed to authenticate token" });
	// 			}
	// 			const user = await User.findById(decode.user_id);
	// 			if (!user) {
	// 				return res.json({ success: false, data: "User not found" });
	// 			}
	// 			user.token = token;
	// 			req.user = user;
	// 			user_id = user.id;
	// 		}
	// 		const auctionId = req.body.auction || req.query.auction || req.params.auction;

	// 		const auctionResult = await Auction.findById(auctionId);
	// 		if (!auctionResult) {
	// 			return res.json({ message: "auction not found" });
	// 		}
	// 		const paymentMethod = req.body.paymentMethod;

	// 		let prices = 0;
	// 		for (const p of paymentMethod) {
	// 			prices += p.price;
	// 		}
	// const totalPrice = req.body.totalPrice
	// 		if (Number(totalPrice) !== prices) {
	// 			return res.json({ message: "your payment is invalid" });
	// 		}

	// 		const newAuctionPool = await new this.model.Pool({
	// 			user: user_id,
	// 			auction: auctionId,
	// 			paymentMethod,
	// 			totalPrice,
	// 		});
	// 		 newAuctionPool.save();

	// 		return res.json("auction pool created");
	// 	} catch (error) {
	// 		console.log(error);
	// 		return res.json("An error occurred");
	// 	}
	// }

	// async getAuctionRequest(req, res) {
	// 	// find and return single request from pool using given auctionId
	// 	try {
	// 		const auctionId = req.body.auctionId;
	// 		let userId;
	// 		let token = req.body.token || req.query.token || req.headers["x-access-token"];

	// 		if (token) {
	// 			return jwt.verify(token, config.JWT_SECRET, (err, decode) => {
	// 				console.log(decode);
	// 				if (err) {
	// 					return res.json({
	// 						success: false,
	// 						data: "failed to authenticate token",
	// 					});
	// 				}
	// 				User.findById(decode.user_id)
	// 					.then((user) => {
	// 						if (user) {
	// 							user.token = token;
	// 							req.user = user;

	// 							userId = user.id;
	// 						}
	// 						console.log(user);
	// 					})
	// 					.catch((err) => {
	// 						console.log(err);
	// 						res.json({
	// 							success: false,
	// 							data: "User not found",
	// 						});
	// 					});
	// 			});
	// 		}

	// 		let auction = await this.model.Pool.findOne({ "user._id": userId, "auction._id": auctionId });
	// 		if (auction) {
	// 			return res.json(auction);
	// 		} else {
	// 			return res.json("you have no record");
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
	async getAuctionRequest(req, res) {
		try {
			const poolauctionId = req.body.poolauctionid;
			let userId;
			let token = req.body.token || req.query.token || req.headers["x-access-token"];
	
			if (token) {
				try {
					const decode = jwt.verify(token, config.JWT_SECRET);
					const user = await User.findById(decode.user_id);
					if (user) {
						user.token = token;
						req.user = user;
						userId = user.id;
						// Now, userId is defined after successful token verification
					}
				} catch (err) {
					console.error(err);
					return res.json({
						success: false,
						data: "Failed to authenticate token",
					});
				}
			}
	
			// Make sure to handle the case where userId remains undefined
			if (!userId) {
				return res.json({
					success: false,
					data: "User ID not found",
				});
			}
	
			// Assuming Pool is a model, use async/await for database operations
			const auction = await PoolModel.findOne({ "user": userId, "_id": poolauctionId });
			console.log(auction);
			if (auction) {
				return res.json(auction);
			} else {
				return res.json({
					success: false,
					data: "You have no record for this auction",
				});
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				success: false,
				data: "Internal server error",
			});
		}
	}
	

	// async updateAuctionRequest(req, res) {
	// 	// Required to have all the fields based of pool model (except userId and auctionId because user can't change them)
	// 	// then find the request via given ID and update it's details and save
	// 	req.checkParams("id", "id is not correct").isMongoId();
	// 	if (this.showValidationErrors(req, res)) return;
	// 	try {
	// 		const id = req.params.id;
	// 		new this.model.Pool(req.body);
	// 		const auction = await this.model.Pool.findByIdAndUpdate(id, {
	// 			paymentMethod: req.body.paymentMethod,
	// 			totalPrice: req.body.totalbasicPrice,
	// 		});
	// 		if (auction) {
	// 			return res.json("auction updated");
	// 		}
	// 		return res.json("update is not successfully");
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
	async updateAuctionRequest(req, res) {
		req.checkParams("id", "ID is not correct").isMongoId();
		if (this.showValidationErrors(req, res)) return;
	
		try {
			const id = req.params.id;
			const updateFields = {
				paymentMethod: req.body.paymentMethod,
				totalPrice: req.body.totalPrice, // corrected field name
				// Add other fields that need to be updated
			};
	
			const updatedAuction = await PoolModel.findByIdAndUpdate(id, updateFields, { new: true });
	
			if (updatedAuction) {
				return res.json({ success: true, message: "Auction updated successfully", auction: updatedAuction });
			} else {
				return res.status(404).json({ success: false, message: "Auction not found" });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ success: false, message: "Internal server error" });
		}
	}
	

	// async destroy(req, res) {
	// 	req.checkParams("id", " id is not correct").isMongoId();
	// 	if (this.showValidationErrors(req, res)) return;

	// 	const id = req.params.id;

	// 	try {
	// 		const result = await this.model.Auction.deleteOne({ _id: id });
	// 		if (result.deletedCount > 0) return res.json("auction request deleted");

	// 		return res.json("auction request not found");
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
	async destroy(req, res) {
		req.checkParams("id", "ID is not correct").isMongoId();
		if (this.showValidationErrors(req, res)) return;
	
		const id = req.params.id;
	
		try {
			const result = await PoolModel.deleteOne({ _id: id });
	
			if (result.deletedCount > 0) {
				return res.json({ success: true, message: "Auction request deleted successfully" });
			} else {
				return res.status(404).json({ success: false, message: "Auction request not found" });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ success: false, message: "Internal server error" });
		}
	}
	
})();
