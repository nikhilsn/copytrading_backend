const router = require('express').Router();
const { getJSONResponse } = require('../functions/responsefunction');
const text = require('../constants/text');
const errorcode = require('../constants/errorcodes');
const dbconstants = require('../constants/dbconstants');
const pool = require('../databaseconf/psqlconf');


router.post('/register', (req, res) => {
    try {
        var { fname, lname, uid, mobile } = req.body;

        getQuery(fname, lname, mobile, uid, (err, query) => {
            if (err) {
                res.send(getJSONResponse(false, errorcode.INVALID_REQUEST, text.TEXT_INVALIDREQUEST, {}))
                return;
            } else {
                pool.query(query).then((result) => {
                    if (result.length > 0) {
                        res.send(getJSONResponse(true, '', text.TEXT_SUCCESS, {}))
                        return;
                    }
                }).catch((err) => {
                    getDeleteQuery(uid, (query) => {
                        pool.query(query).then((result) => {
                            res.send(getJSONResponse(false, errorcode.INVALID_REQUEST, text.TEXT_INVALIDREQUEST));
                        }).catch((err)=>{
                            res.send(getJSONResponse(false, errorcode.INVALID_REQUEST, text.TEXT_INVALIDREQUEST));
                        });
                    });
                });
            }
        });

    } catch (err) {
        res.send(getJSONResponse(false, errorcode.SOMETHING_WENT_WRONG, text.TEXT_SOMETHINGWENTWRONG, {}));
    }
});

function getQuery(fname, lname, mobile, uid, cb) {
    var query = ``;
    if (uid) {
        if (fname && uid) {
            query = query + `INSERT INTO users (uid, key, value) VALUES ('${uid}', '${dbconstants.DB_FNAME}', '${fname}');`;
        }
        else {
            return cb(text.TEXT_INVALIDREQUEST)
        }
        if (lname && uid) {
            query = query + `INSERT INTO users (uid, key, value) VALUES ('${uid}', '${dbconstants.DB_LNAME}', '${lname}');`;
        } else {
            return cb(text.TEXT_INVALIDREQUEST)
        }
        if (mobile && uid) {
            query = query + `INSERT INTO users (uid, key, value) VALUES ('${uid}', '${dbconstants.DB_MOBILE}', '${mobile}');`;
        }
        else {
            return cb(text.TEXT_INVALIDREQUEST)
        }
    } else {
        return cb(text.TEXT_INVALIDREQUEST)
    }
    return cb(false, query);
}

function getDeleteQuery(uid, cb) {
    var query = `DELETE FROM users WHERE uid = '${uid}'`;
    cb(query);
}


module.exports = router