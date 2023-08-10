const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const User_activity = require('../models/User_activity')
const moment = require('moment')
require('dotenv').config()


router.post('/register', async (req, res) => {
    //check if already an employee
    try {
        const is_registerd = await User.findOne({ email: req.body.email })
        if (is_registerd === null) {
            const new_pass = await bcrypt.hash(req.body.password, 10);
            req.body.password = new_pass;
            const info = await User.create(req.body);
            const user_info = await info.save();
            const user_activity = await User_activity.create({
                user_id: user_info._id,
                last_login: 0,
                last_logout: 0,
                duration: 0,
            })
           await user_activity.save();
            return res.status(201).send("Employee registered successfully");
        }
        else {
            return res.status(500).send("Employee already exists");
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
})
function calculateDuration(currentHour, currentMinutes, lastHour, lastMinutes) {
    // Convert hours and minutes to minutes for easier calculation
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const lastTimeInMinutes = lastHour * 60 + lastMinutes;

    // Calculate the time difference in minutes
    let timeDifferenceInMinutes = currentTimeInMinutes - lastTimeInMinutes;

    // If the current time is earlier than the last time, it means the duration spans across two days
    if (timeDifferenceInMinutes < 0) {
        timeDifferenceInMinutes += 24 * 60;
    }

    // Convert the time difference from minutes to hours
    const durationInHours = timeDifferenceInMinutes / 60;

    // Return the duration rounded to two decimal places
    return Math.round(durationInHours * 100) / 100;
}
//we will provide functionality to login and logout but if user already has access token then we check if it is expired or not so in the req we will send access token and verify it if valid then no need to generate another token else it means it is its first login of the day.
router.post('/login', async (req, res) => {
    // Check if user exists
    let user = await User.findOne({ email: req.body.email });
    try {
        if (user !== null) {
            //compare passowords
            const isvalid = await bcrypt.compare(req.body.password, user.password);
            if (isvalid) {
                //check if access token present is valid if yes then verify it else assign another one
                try {
                    //In between of the day login is done again after logout
                    const decoded = jwt.verify(req.body.access_token, process.env.JWT_KEY);
                    const id = decoded.data.id;
                        await User_activity.findOneAndUpdate({ user_id: id }, { last_login: new Date()});
                    return res.status(200).send(req.body.access_token);
                    
                } catch (error) {
                    //start of the day
                    const datee = new Date()
                    await User_activity.findOneAndUpdate({ user_id: user._id }, { last_login: datee, last_logout: 0, duration: 0 });
                    const credentials = {
                        id: user.id,
                        admin: user.admin
                    }
                    const token = jwt.sign({
                        data: credentials
                    }, process.env.JWT_KEY, { expiresIn: "12h" });
                    return res.status(200).send(token);
                }
            }
        }

        // If user doesn't exist or password is incorrect, return an error
        return res.status(401).send("Invalid credentials");
    } catch (error) {
        return res.status(500).send(error.message);
    }
})
router.post('/logout', async (req, res) => {
    //update last_logout
    try {
        const decoded = jwt.verify(req.body.access_token, process.env.JWT_KEY);
        const id = decoded.data.id;
        const cur = new Date();
        await User_activity.findOneAndUpdate({ user_id: id }, { last_logout: cur })
        return res.status(200).send("Logout successfully")
    } catch (error) {
        return res.status(500).send(error.message)
    }

})
router.get('/:token', async (req, res) => {
    try {
        var decoded = jwt.verify(req.params.token, process.env.JWT_KEY);
        const id = decoded.data.id;

        const user = await User.findOne({ _id: id }).select("-password")
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send("login again")
    }
})


//this api is used to concecutivelly add active duration on website through this api
router.post('/duration', async (req, res) => {
    try {
        const decoded = jwt.verify(req.body.access_token, process.env.JWT_KEY);
        const id = decoded.data.id;
        const user_activity = await User_activity.findOne({ user_id: id })
        const cur = new Date();
        const lastduration = user_activity.duration;
        const duration = calculateDuration(cur.getHours(), cur.getMinutes(), user_activity.last_login.getHours(), user_activity.last_login.getMinutes())
        const total_duration = lastduration + duration;
        await User_activity.findOneAndUpdate({ user_id: req.params.id }, {duration: total_duration});
        return res.status(200).send(`duration updated succesfully. Current spend time in hrs are ${total_duration}`);
    } catch (error) {
        return res.status(500).send(error.message)
    }
})

router.post('/users', async(req, res)=>{
    try {
        const decoded = jwt.verify(req.body.access_token, process.env.JWT_KEY);
        const isadmin = decoded.data.admin;
        if(isadmin)
        {
            const data = await User_activity.find().populate("user_id");
            return res.status(200).send(data);
        }
    } catch (error) {
        return res.status(500).send(error.message) 
    }
})
module.exports = router