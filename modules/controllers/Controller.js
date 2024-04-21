const config = require("../config");

const User = require(`${config.path.model}/User`)
const Auction = require(`${config.path.model}/Auction`)
const PoolModel = require(`${config.path.model}/auction-pool`)

module.exports = class Controller{
    constructor(){
        this.model = {User,Auction,PoolModel}
    }
    showValidationErrors(req,res){
        let errors= req.validationErrors()
        if(errors){

          return res.status(422).json({
            message:errors.map(error =>{
             
              return {
                "field":error.param,
                "message": error.msg
              }
            }),
            success:false
          })
        }
    }
}