const router = require('express').Router();
const text = require('../constants/text');
const errorcodes = require('../constants/errorcodes');
const dbconstants = require('../constants/dbconstants');
const { getJSONResponse } = require('../functions/responsefunction');
const pool = require('../databaseconf/psqlconf');

router.get('/alltraders', (req, res) => {
    try {
        var { index } = req.body;
        getAllTradersQuery(index, (err, query)=>{
            if(err){
                res.send(getJSONResponse(false, errorcodes.INVALID_REQUEST, text.TEXT_INVALIDREQUEST));
                return;
            }else{
                pool.query(query).then((result) => {
                    if (result.rowCount > 0) {
                        res.send(getJSONResponse(true, '', '', result.rows));
                    } else {
                        res.send(getJSONResponse(false, errorcodes.NO_TRADER_FOUND, text.TEXT_NOTRADERFOUND));
                    }
                }).catch((err) => {
                    console.log(err);
                    res.send(getJSONResponse(false, errorcodes.SOMETHING_WENT_WRONG, text.TEXT_SOMETHINGWENTWRONG));
                });
            }
        })
      
    } catch (err) {
        console.log(err);
        res.send(getJSONResponse(false, errorcodes.SOMETHING_WENT_WRONG, text.TEXT_SOMETHINGWENTWRONG));
    }
});

function getAllTradersQuery(index, cb){
    var query
    if(index){
        query = `SELECT * FROM users where uid in (SELECT uid FROM users WHERE key = '${dbconstants.DB_USERTYPE}' AND value = '${text.TEXT_TRADER}' ORDER BY uid OFFSET ${index} limit 10)`;
    }else{
        cb(text.TEXT_INVALIDREQUEST);
        return;
    }
    cb(false, query);
    
}


module.exports = router