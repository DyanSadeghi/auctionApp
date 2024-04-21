module.exports = new (class HomeController {
	index(req, res) {
		res.status(200).json({
			status: 200,
			success: true,
			message: "Welcome to Api",
		});
	}
})();
