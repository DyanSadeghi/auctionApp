const config = require("../config");
const expressValidator = require("express-validator");
const UserTransform = require("../utils/UserTransform")

const Controller = require(`${config.path.controller}/Controller`);
const bcrypt = require("bcrypt");

module.exports = new (class AuthController extends Controller {
	async register(req, res) {
		req.checkBody("name", " Name is required ").notEmpty();
		req.checkBody("email", "Email is required").notEmpty();
		req.checkBody("password", "Password is required").notEmpty();
		req.checkBody("email", "the format of email is not valid").isEmail();

		if (this.showValidationErrors(req, res)) return;

		try {
			await this.model
				.User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
				})
				.save();
			res.status(200).json({
				status: 200,
				message: "user created successfully",
				success: true,
			});
		} catch (error) {
			console.log(error);
			if (error) {
				if (error.code == 11000) {
					res.json({
						message: "The email should not be duplicated",
						success: true,
					});
				}
			}
		}
	}

	async login(req, res) {
		req.checkBody("email", "Email is required").notEmpty();
		req.checkBody("password", "password is required ").notEmpty();
		if (this.showValidationErrors(req, res)) return;

		try {
			await this.model.User.findOne({ email: req.body.email }).then((user) => {
				if (user == null)
					return res.status(422).json({
						message: "The entered information is not correct",
						success: false,
					});
				bcrypt.compare(req.body.password, user.password, function (err, result) {
					console.log(req.body.password);
					console.log(user.password);
					if (!result) {
						return res.status(422).json({
							message: "The entered information is not correct",
							success: false,
						});
					}
					return res.json({
                        data:new UserTransform().transform(user,true),
						message: "You have successfully logged in ",
					});
				});
			});
		} catch (error) {}
	}
})();
