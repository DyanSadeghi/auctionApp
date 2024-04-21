const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timeStamps = require("mongoose-timestamp");
const bcrypt= require("bcrypt")

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, default: "user" },
});

UserSchema.plugin(timeStamps);
UserSchema.pre("save", function (next) {
	bcrypt.hash(this.password, 10, (err, hash) => {
		this.password = hash;
		next(err);
	});
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
