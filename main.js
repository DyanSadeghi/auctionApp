const app = require("express")();
const { default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const { application } = require("express");
const jwt = require("jsonwebtoken");
const config = require("./modules/config");
global.config = require("./modules/config");
const path = require("path");
const router = require("./modules/routes/api/mainRoutes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(expressValidator());
app.use("/", router);
//Connect to DB
mongoose
	.connect("mongodb://127.0.0.1:27017/Auction")
	.then(() => console.log("connect to DB successfully"))
	.catch((err) => console.log(err));
mongoose.Promise = global.Promise;

//Listening to server
app.listen(config.port, () => {
	console.log(`Server is Running On Port: http://localhost:${config.port}`);
});
