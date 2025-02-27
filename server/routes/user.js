const {signUp, signIn, signOut, updateUser, me}= require('../controllers/user');
const router = require('express').Router();
const auth = require('../middleware/auth');
router.get('/me',auth, me);
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out',auth, signOut);
router.patch('/update-user/:userId',auth, updateUser);

module.exports = router;