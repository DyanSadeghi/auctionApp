const Controller = require(`${config.path.controller}/controller`);
const jwt = require("jsonwebtoken");
const util = require('util');
const jwtVerify = util.promisify(jwt.verify);
const User = require(`${config.path.model}/User`);
const Auction = require(`${config.path.model}/Auction`);
const Pool = require(`${config.path.model}/auction-pool`);

module.exports = new (class UserController extends Controller {
	async whoAmI(req, res) {
		try {
			let token = req.body.token || req.query.token || req.headers["x-access-token"];

			if (token) {
				return jwt.verify(token, config.JWT_SECRET, (err, decode) => {
					console.log(decode);
					if (err) {
						return res.json({
							success: false,
							data: "failed to authenticate token",
						});
					}
					User.findById(decode.user_id)
						.then((user) => {
							if (user) {
								user.token = token;
								req.user = user;

								return res.json(user);
							}
						})
						.catch((err) => {
							console.log(err);
							res.json({
								success: false,
								data: "User not found",
							});
						});
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
	// async myAuctions(req, res) {
	// 	let user_id;
	// 	let token = req.body.token || req.query.token || req.headers["x-access-token"];

	// 	if (token) {
	// 		return jwt.verify(token, config.JWT_SECRET, (err, decode) => {
	// 			console.log(decode);
	// 			if (err) {
	// 				return res.json({
	// 					success: false,
	// 					data: "failed to authenticate token",
	// 				});
	// 			}
	// 			User.findById(decode.user_id)
	// 				.then((user) => {
	// 					if (user) {
	// 						user.token = token;
	// 						req.user = user;
	// 						user_id = user.id;
	// 					}
	// 				})

	// 				.catch((err) => {
	// 					console.log(err);
	// 					res.json({
	// 						success: false,
	// 						data: "User not found",
	// 					});
	// 				});
	// 		});
	// 	}

	// 	let myAuctionRequests = this.model.Pool.filter((item) => item.user.id === user_id);
	// 	let auctions = [];

	// 	if (myAuctionRequests) {
	// 		myAuctionRequests.map(async (request) => {
	// 			const auction = await this.model.Auction.findById(request.auction.id);
	// 			auctions.push(auction);
	// 		});
	// 		return res.json(auctions);
	// 	} else {
	// 		return res.json([]);
	// 	}
	// }
	// catch(error) {
	// 	console.log(error);
	// }


async  myAuctions(req, res) {
    try {
        let user_id;
        let token = req.body.token || req.query.token || req.headers["x-access-token"];

        if (token) {
            const decode = await jwtVerify(token, config.JWT_SECRET);
            console.log(decode);
            if (!decode) {
                return res.json({
                    success: false,
                    data: "failed to authenticate token",
                });
            }

            const user = await User.findById(decode.user_id);
            if (!user) {
                return res.json({
                    success: false,
                    data: "User not found",
                });
            }
            user.token = token;
            req.user = user;
            user_id = user.id;
        }

        const myAuctionRequests = await Pool.find({ "user.id": user_id });
        let auctions = [];

        for (const request of myAuctionRequests) {
            const auction = await Auction.findById(request.auction.id);
            auctions.push(auction);
        }

        return res.json(auctions);
    } catch (error) {
        console.log(error);
        return res.json([]);
    }
}



})();
