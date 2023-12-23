var jwt = require('jsonwebtoken');
const storage = require('node-persist');
var user = require('../model/usermodel');
var reel = require('../model/reelmodel');

const nodemailer = require('nodemailer');


// register a new user

const user_register = async (req, res) => {

    var check = await user.find({ "email": req.body.email });

    if (check.length == 0) {
        var name = req.body.name;
        var username = req.body.username.toLowerCase();
        var email = req.body.email.toLowerCase();
        var password = req.body.password;
        var contact = req.body.contact;
        var gender = req.body.gender.toLowerCase();

        var data = await user.create({ "name": name, "username": username, "email": email, "password": password, "contact": contact, "gender": gender });

        console.log(data.id);
        await storage.init();
        await storage.setItem("user_id", data.id)
        
        res.status(200).json({
            status: "user successfuly register",
            data
        })
    }
    else {
        res.status(200).json({
            status: "user already register"
        })
    }
}

// user login

const user_login = async (req, res) => {

    var data = await user.find({
        $or: [
            { "username": req.body.username.toLowerCase() },
            { "email": req.body.username.toLowerCase() }
        ]
    })

    await storage.init();
    var x = await storage.getItem("user_id");

    if (x == undefined) {
        if (data.length == 1) {
            if (data[0].password == req.body.password) {

                var token = jwt.sign({ id: data[0].id }, 'instagram');

                await storage.init();
                await storage.setItem("user_id", data[0].id)

                res.status(200).json({
                    status: "successfully login",
                    token
                })

            }
            else {
                res.status(200).json({
                    status: "Check Your password"
                })
            }
        }
        else {
            res.status(200).json({
                status: "Check Your Email and Password"
            })
        }
    }
    else {
        res.status(200).json({
            status: "user is already Login"
        })
    }
}

// forget password

const otp_generate = async (req, res) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rahualporiya@gmail.com',
            pass: 'vzex vwcf znbo jydf'
        }
    });

    var n = (Math.random()*10000000000000000).toString()[0]

    var otp =  Math.floor((Math.random()+n) * 1000000);

    
    
    var obj = {
        otp: otp,
        email:req.body.email
    }

    res.cookie("otp",obj);

    let mailOptions = {
        from: 'rahualporiya@gmail.com',
        to: req.body.email,
        subject: 'OTP for forget instagram password',
        text: 'OTP for change instagram passoword is ' + otp + ' Please do not share otp to anyone Thank you for using instagram'
    };
    

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    res.status(200).json({
        status:"success",
        otp
    })

}

// check otp

const check_otp = async(req, res) => {

    var otp = req.cookies.otp.otp

    if(otp == req.body.otp){


        res.status(200).json({
            status:"success"
        })
    }
    else{
        res.status(200).json({
            status:"otp is not valid"
        })
    }

}

const update_password = async (req, res) => {

    var data = await user.find({"email":req.cookies.otp.email})
    console.log(data[0].id);
    var update = await user.findByIdAndUpdate(data[0].id,{"password":req.body.password})

    res.status(200).json({
        data
    })
}

// logout

const logut_user = async (req, res) => {
    await storage.init();
    await storage.clear();

    res.status(200).json({
        status: "Logout Successful"
    })

}

// get user information

const user_info = async (req, res) => {

    var id = req.params.userid;

    data = await user.findById(id);

    console.log(data);
    res.status(200).json({
        status: "success",
        data
    })
}

// edit user profile

const user_update = async (req, res) => {
    var id = req.params.userid;
    var result = await user.findById(id)
    var name, username, email, password, contact, gender

    console.log(result);

    req.body.name ? name = req.body.name : result.name
    req.body.username ? username = req.body.username.toLowerCase() : result.username
    req.body.email ? email = req.body.email.toLowerCase() : result.email
    req.body.password ? password = req.body.password : result.password
    req.body.contact ? contact = req.body.contact : result.contact
    req.body.gender ? gender = req.body.gender.toLowerCase() : result.gender


    await user.findByIdAndUpdate(id, { "name": name, "username": username, "email": email, "password": password, "contact": contact, "gender": gender });

    var data = await user.findById(id)
    res.status(200).json({
        status: "user profile successfuly updated",
        data
    })
}

// follow to user

const follow = async (req, res) => {
    var id = req.params.userid;
    var userid = req.body.userid
    var data = await user.findById(id)
    var data1 = await user.findById(userid)

    var following = data.following;
    var follower = data1.follower;

    var user_following = following.push(userid);
    var user_follower = follower.push(id);

    var update_following = await user.findByIdAndUpdate(id,{"following":following});
    var update_follower = await user.findByIdAndUpdate(userid,{"follower":follower});


    res.status(200).json({
        status: "successfuly follow to user",
        update_following,
        update_follower
    })


}

// unfollow to user

const unfollow = async (req, res) => {

    var id = req.params.userid;
    var userid = req.body.userid
    var data = await user.findById(id)
    var data1 = await user.findById(userid)

    var following = data.following.filter(item => item != userid);
    var follower = data.follower.filter(item => item != id);

    var update_following = await user.findByIdAndUpdate(id, { "following": following})

    var update_follower = await user.findByIdAndUpdate(userid, { "follower": follower})

    res.status(200).json({
        status: "successfuly unfollow to user",
        update_following,
        update_follower
    })

}

// search of user

const search_user = async (req, res) => {

    try {
        var data = await user.find({
            $or: [
                {
                    name: {
                        $regex: req.body.search
                    }
                },
                {
                    username: {
                        $regex: req.body.search.toLowerCase()
                    }
                }
            ]

        })

        if (data.length != 0) {
            res.status(200).json({
                Status: "success",
                data
            })
        }
        else {
            res.status(200).json({
                status: "not found"
            })
        }



    } catch (error) {
        console.error(error)
    }


}

// create a new reel

const new_reel = async (req, res) => {

    var data = await reel.create(req.body);

    res.status(200).json({
        status: "successfully created reel"
    })

}

// get reel information

const reel_info = async (req, res) => {
    var id = req.params.reelid

    var data = await reel.findById(id);

    res.status(200).json({
        status: "get reel information",
        data
    })
}

// edit reel

const reel_update = async (req, res) => {
    var id = req.params.reelid;

    var data = await reel.findByIdAndUpdate(id, req.body);

    res.status(200).json({
        status: "updated reels"
    })
}

// delete a reel

const delete_reel = async (req, res) => {
    var id = req.params.reelid;

    var data = await reel.findByIdAndDelete(id);

    res.status(200).json({
        status: "reel successfully deleted"
    })
}

// like reel

const like_reel = async (req, res) => {
    var id = req.params.reelid;
    var userlike = req.body.userid;

    var data = await reel.findById(id);

    // console.log('data', data);
    // console.log('like', data.like);

    var like = data.like
    // console.log(like);
    like.push(userlike)

    // var update = await reel.findByIdAndUpdate(id, { "like": [...data.like, userlike] })
    var update = await reel.findByIdAndUpdate(id, { "like": like })

    res.status(200).json({
        status: "successfully like a reel",
        update
    })
}

// unlike reel

const unlike_reel = async (req, res) => {
    var id = req.params.reelid;

    var data = await reel.findById(id);

    var unlike = data.like.filter(item => item != req.body.userid)

    var update = await reel.findByIdAndUpdate(id, { "like": unlike })

    res.status(200).json({
        status:"successfully unlike to reel",
        update
    })



}

// get comment on a reel

const get_comment = async (req, res) => {
    var id = req.params.reelid;

    var data = await reel.findById(id).populate({path:'comment.commentuser'})
    var x = data.comment

    res.status(200).json({
        status:"successfull get a comment",
        x
    })
}

// add a comment to a reel

const add_comment = async (req, res) => {
    var id = req.params.reelid;
    var comment = {
        usercomment: req.body.usercomment,
        commentuser: req.body.userid
    }

    var data = await reel.findById(id)

    var comments = data.comment;
    comments.push(comment);

    var update = await reel.findByIdAndUpdate(id,{"comment":comments})


    res.status(200).json({
        status:"comment successfuly add to a reel",
        
    })

}

const harsh = async (req, res) => {

    var alphabet = 'abcdefghijklmnopqrstuvwxyz'
    var random = Math.random()
    var randomLetter = alphabet[Math. floor(random* alphabet.length)];

    // console.log(alphabet[Math. floor(Math. random())]);
    // console.log(alphabet.length);
    // console.log(Math.floor(Math.random()*alphabet.length));
    console.log(typeof(alphabet));
    console.log(random);
    console.log(random*alphabet.length);
    console.log(Math.floor(random*alphabet.length));
    res.status(200).json({
        randomLetter
    })

}


module.exports = {
    user_register,
    user_login,
    otp_generate,
    check_otp,
    update_password,
    logut_user,
    user_info,
    user_update,
    follow,
    unfollow,
    search_user,
    new_reel,
    reel_info,
    reel_update,
    delete_reel,
    like_reel,
    unlike_reel,
    get_comment,
    add_comment,
    harsh

}