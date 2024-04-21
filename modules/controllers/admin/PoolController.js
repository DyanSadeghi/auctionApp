const Controller = require(`${config.path.controller}/controller`);
const Pool = require(`${config.path.model}/auction-pool`)


module.exports = new (class PoolController extends Controller {
async index(req,res){
    try {
        const poolAuctions = await Pool.find();
        if (poolAuctions) {
          return res.json(poolAuctions);
        }
      } catch (err) {
        console.log(err);
      }
}
})()