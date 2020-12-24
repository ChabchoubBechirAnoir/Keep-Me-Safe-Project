var express = require('express');
var router = express.Router();
var identityProvider = require('../controllers/identity.provider')
/* GET users listing. */
router.get('/',[identityProvider.getUsers]);

router.post('/register',[identityProvider.signUp]);

router.post('/login',[identityProvider.signIn]);
module.exports = router;