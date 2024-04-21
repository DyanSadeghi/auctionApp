const Controller = require(`${config.path.controller}/controller`)

const {body} = require("express-validator")

module.exports = new class AuctionController extends Controller{
    async index(req,res){
        try {
            const auctions = await this.model.Auction.find()
            if(auctions){
                return res.json(auctions)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async store (req,res){
        req.checkBody("basicPrice","basicprice is required").notEmpty()
        req.checkBody("meterage","meterage is required").notEmpty()
        req.checkBody("address","address is required").notEmpty()
        req.checkBody("timeAuction","timeauction is required").notEmpty()

        if(this.showValidationErrors(req,res))return 

        try {
            let newAuction = await new this.model.Auction({
                basicPrice : req.body.basicPrice,
                meterage : req.body.meterage,
                address : req.body.address,
                timeAuction : req.body.timeAuction

            })
            newAuction.save()
            return res.json("auction created")
        } catch (error) {
            console.log(error);
        }

    }
    async update(req,res){
        req.checkParams("id","id is not correct").isMongoId()
        if(this.showValidationErrors(req,res)) return
        try {
            const id = req.params.id
            new this.model.Auction(req.body)
            const auction = await this.model.Auction.findByIdAndUpdate(id,{
                basicPrice : req.body.basicPrice,
                meterage : req.body.meterage,
                address : req.body.address,
                timeAuction : req.body.timeAuction
            })
            if(auction){
                return res.json("auction updated")
            } res.json("update is not successfully")
        } catch (error) {
            console.log(error);
        }
    }

    async destroy(req,res){
        req.checkParams("id"," id is not correct").isMongoId()
        if(this.showValidationErrors(req,res))return

        const id = req.params.id

        try {
            const result = await this.model.Auction.deleteOne({_id:id})
            console.log(result);
            if(result.deletedCount > 0) return res.json("auction deleted")

            return res.json("auction not found")
        } catch (error) {
            console.log(error);
        }
    }
}

