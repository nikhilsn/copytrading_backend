const router = require('express').Router();
const text = require('../constants/text');
const errorcodes = require('../constants/errorcodes');
const dbconstants = require('../constants/dbconstants');
const {getJSONResponse} = require('../functions/responsefunction');
const pool = require('../databaseconf/psqlconf');

router.get('/alltraders', (req, res)=>{
    try{
        var query = `SELECT * FROM users where uid in (SELECT uid FROM users WHERE key = '${dbconstants.DB_USERTYPE}' AND value = '${text.TEXT_TRADER}')`;
        pool.query(query).then((result)=>{
            if(result.rowCount>0){
                res.send(getJSONResponse(true,'', '', result.rows));
            }else{
                res.send(getJSONResponse(false, errorcodes.NO_TRADER_FOUND, text.TEXT_NOTRADERFOUND));
            }
        }).catch((err)=>{
            res.send(getJSONResponse(false, errorcodes.SOMETHING_WENT_WRONG, text.SOMETHING_WENT_WRONG));
        });
    }catch(err){
        res.send(getJSONResponse(false, errorcodes.SOMETHING_WENT_WRONG, text.TEXT_SOMETHINGWENTWRONG));
    }
});


module.exports  = router