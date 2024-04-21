

module.exports = (req, res, next) => {
    if(req.user.role == "admin"){

      next()
      return
    }
    return res.status(403).json({
      message:"you dont have permission for using this Route",
      success: true
    })
};
