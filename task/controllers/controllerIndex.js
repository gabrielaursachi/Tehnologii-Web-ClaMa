const fs = require('fs')
const { checkIfUsernameExists } = require('../utils/database')
const conn = require('../utils/database')
const schemas = require(`../models/models`)
const { StatusCodes } = require('http-status-codes')
const json = require(`../utils/handleJson`)

function register(req, res) {
    console.log(`register@controllerIndex`)
    json.requestJSON(req, res, function(recievedJSON) {
        const { error, value } = schemas.accountModel.validate(recievedJSON)
            //value contine email+parola sau username+parola
        if (error) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: error.message
            })
            return
        }
        /*
            redirect
            response.writeHead(301,
  {Location: 'http://whateverhostthiswillbe:8675/'+newRoom}
);
            */
        conn.checkIfUserExists(recievedJSON, function(err, data) {
            if (err) {
                res.statusCode = StatusCodes.BAD_REQUEST
                json.responseJSON(res, {
                    error: err.message
                })
                console.log(err.message)
                return
            } else {
                console.log("result from db is : ", data.rowCount);
                if (data.rowCount == 1) {
                    console.log('Unavailable username')
                    res.statusCode = 300;
                    json.responseJSON(res, {
                        registered: false,
                        error: "Unavailable username"
                    })
                    return
                } else {
                    conn.saveUser(recievedJSON, res)
                }
            }
        });
    })
}

function authenticate(req, res) {
    console.log(`authenticate@controllerIndex`)
    json.requestJSON(req, res, function(recievedJSON) {
        // console.log(`55@controllerIndex`)
        const { error, account } = schemas.authModel.validate(recievedJSON)
        if (error) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: error.message
            })
            return
        } else {
            conn.checkAuthData(recievedJSON, res)
        }
    })
}

module.exports = { register, authenticate }