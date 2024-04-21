const express = require("express");
const router = express.Router();
const path = require("path");

const apiAuth = require("../../middleware/apiAuth");
const apiAdmin = require("../../middleware/apiAdmin");
const config = require("../../config");
const AuthController = require("../../controllers/AuthController");

const Controller = config.path.controller;
const HomeController = require(`${Controller}/HomeController`);
const UserController = require(`${Controller}/UserController`);
const PoolController = require(`${Controller}/PoolController`);
const AuctionController = require(`${Controller}/AuctionController`);

const AdminAuctionController = require(`${Controller}/admin/AuctionController`);
const AdminPoolController = require(`${Controller}/admin/PoolController`);
const adminRouter = express.Router();

router.get("/", HomeController.index);
//  admin Routes
adminRouter.get("/poolauctions",apiAuth, apiAdmin, AdminPoolController.index.bind(AdminPoolController));
adminRouter.get("/auctions",apiAuth, apiAdmin, AdminAuctionController.index.bind(AdminAuctionController));
adminRouter.post("/auction", apiAuth,apiAdmin, AdminAuctionController.store.bind(AdminAuctionController));
adminRouter.put(
	"/auction/:id",apiAuth,
	apiAdmin,
	AdminAuctionController.update.bind(AdminAuctionController)
);
adminRouter.delete(
	"/auction/:id",apiAuth,
	apiAdmin,
	AdminAuctionController.destroy.bind(AdminAuctionController)
);

// user Routes

router.get("/auctions", apiAuth, AuctionController.index.bind(AuctionController));
router.get("/auctions/:id", apiAuth, AuctionController.single.bind(AuctionController));

router.post("/register", AuthController.register.bind(AuthController));
router.post("/login", AuthController.login.bind(AuthController));

router.post("/poolauctions", apiAuth, PoolController.submit.bind(PoolController));
router.get("/poolauctions", apiAuth, PoolController.getAuctionRequest.bind(PoolController));
router.put("/poolauctions/:id", apiAuth, PoolController.updateAuctionRequest.bind(PoolController));
router.delete("/poolauctions/:id", apiAuth, PoolController.destroy.bind(PoolController));

router.get("/whoami", apiAuth, UserController.whoAmI.bind(UserController));
router.get("/myauctions", apiAuth, UserController.myAuctions.bind(UserController));

router.use("/admin",adminRouter);

module.exports = router;
