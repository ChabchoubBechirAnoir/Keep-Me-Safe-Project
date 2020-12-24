const identityModel = require('../models/user');
const argon2 = require('argon2');
const uuidv4 = require('uuidv4');
const validityTime = require('../config.js')().validityTime;
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res , next)=> {
    try {
        req.body.password = await argon2.hash(req.body.password, {
            type : argon2.argon2id,
            memoryCost : 2**16,
            hashLength : 64,
            saltLength : 32,
            timeCost : 11,
            parallelism : 2
        });
        req.body.permissionLevel = 1 ;
        const saved = await identityModel.createIdentity(req.body)
        return res.status(201).send({id : saved._id});
    }catch(err){
        return next(err);
    }
};

exports.signIn = async (req, res , next) => {
    try {
    identityModel.findByUsername(req.body.username).then(async (user)=> {
        if(!user[0]){
            return res.status(400).send({errors : ['Invalid Credentials']});
        }else{
            if(await argon2.verify(user[0].password,req.body.password)){
                //Create JWT Token and return it
                jwt.sign({user : user}, require('crypto').randomBytes(64).toString('hex'), (err, token) => {
                    res.json({
                        token
                    });
                });
                var now = Math.floor(Date.now()/1000);
                req.body = {
                    iss : 'urn:yourDomain.tld',
                    aud : 'urn:' + (req.get('origin') ? req.get('origin') : '*.yourDomain.tld'),
                    sub : user[0].username ,
                    name : user[0].forename + ' ' + user[0].surname,
                    userId : user[0]._id,
                    roles : user[0].permissionLevel,
                    jti : uuidv4(),
                    iat : now,
                    exp : now + validityTime
                };
            }else{
                return res.status(400).send({errors : ['Invalid Credentials']});
            }
        }
    });
    }catch(err){
        return next(err);
    }
};
exports.getUsers =  function(req, res, next) {
    identityModel.find(function (error, users){
        if(error)
            return next(error);
        res.json(users);
    });
};

exports.minimunPermissionLevelRequired = function(permissionLevel) {
};