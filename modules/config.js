const path = require("path");

module.exports = {
	port: 3000,
	JWT_SECRET: "u4i5o6e9r8t",
	path: {
		model: path.resolve("./modules/models"),
		controller: path.resolve("./modules/controllers"),
	},
};
