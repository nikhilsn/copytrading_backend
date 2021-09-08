const express = require('express');
const router = express.Router();

const text = require('../constants/text');
const errorcodes = require('../constants/errorcodes');
const dbconstants = require('../constants/dbconstants');
const { getJSONResponse } = require('../functions/responsefunction');
const pool = require('../databaseconf/psqlconf');


router.post('/login', (req, res) => {
    try {
        var { mobile } = req.body;
        getQuery(mobile, (err, query) => {
            if (err) {
                console.log(getJSONResponse(false, errorcodes.INVALID_REQUEST, text.TEXT_INVALIDREQUEST));
                res.send(getJSONResponse(false, errorcodes.INVALID_REQUEST, text.TEXT_INVALIDREQUEST));
                return;
            } else {
                pool.query(query).then((result) => {
                    if (result.rowCount > 0) {
                        res.send(getJSONResponse(true, '', '', result.rows));
                    } else {
                        res.send(getJSONResponse(false, errorcodes.USER_NOT_FOUND, text.TEXT_USERNOTFOUND, {}))
                    }
                }).catch((err) => {
                    res.send(getJSONResponse(false, errorcodes.INVALID_REQUEST, text.TEXT_INVALIDREQUEST))
                });
            }
        });

    } catch (err) {
        res.send(
            getJSONResponse(false, errorcodes.SOMETHING_WENT_WRONG, text.TEXT_SOMETHINGWENTWRONG)
        );
    }
});

function getQuery(mobile, cb) {
    if (mobile) {
        var query = `SELECT * FROM users WHERE uid = (SELECT uid FROM users WHERE key = '${dbconstants.DB_MOBILE}' AND value = '${mobile}')`;
        cb(false, query);
     } else {
        cb(text.TEXT_INVALIDREQUEST);
     }
}

module.exports = router