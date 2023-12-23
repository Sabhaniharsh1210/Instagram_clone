var express = require('express');
var cors = require('cors')
const cookieParser = require("cookie-parser");
var router = express.Router();

router.use(cors());
router.use(cookieParser());

// middleware authantication

const {checktoken } = require('../middleware/auth')

// require from usercontrollar
const {user_register, user_login, otp_generate, check_otp, update_password, logut_user, user_info, user_update, follow, unfollow, search_user, harsh, new_reel, reel_info, reel_update, delete_reel, like_reel, unlike_reel, get_comment, add_comment} = require('../controllar/usercontrollar');


/* register a new user */

router.post('/user/register',user_register);

/* user login / logout */

router.post('/login', user_login)
router.post('/logout', logut_user)

/* forget password */

router.get('/user/otp_generate', otp_generate)
router.get('/user/otp_check',check_otp)
router.get('/user/update_password',update_password)

/* get user information */

router.get('/user/:userid', checktoken, user_info)

/* update user profile */

router.put('/user/:userid/edit',checktoken, user_update)

/* follow to user */

router.post('/user/:userid/follow', follow)

/* unfollow to user */

router.post('/user/:userid/unfollow', unfollow)

/* search of user */

router.get('/search/users', search_user)

/* create new reel */

router.post('/reels/create', new_reel)

/* get reel information */

router.get('/reels/:reelid', reel_info)

/* edit reel */

router.put('/reels/:reelid/edit', reel_update)

/* delete reel */

router.delete('/reels/:reelid/delete', delete_reel)

/* like reel */

router.post('/reels/:reelid/like', like_reel)

/* unlike reel */

router.delete('/reels/:reelid/like', unlike_reel)

/* get comment on a reel */

router.get('/reels/:reelid/comments', get_comment)

/* add a comment to a reel */

router.post('/reels/:reelid/comments/create', add_comment)

/* only practice perpose */
router.post('/name', harsh)

module.exports = router;