const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router();


/* Users Colllecton With API */

// Create Users
router.post("/users", async(req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }

})

// User Login
router.post("/users/login", async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(404).send()
    }
})

// Logout User
router.post("/users/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();

        res.send("Success Logout ")
    } catch (e) {
        res.status(500).send(e)
    }
})

// Logout all

router.post("/users/logoutAll", auth, async(req, res) => {
    try {
        req.user.tokens = [];
        req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})


// Get Users
router.get("/users/me", auth, async(req, res) => {
    res.send(req.user)
        // try {
        //     const users = await User.find({})
        //     res.status(201).send(users)
        // } catch (error) {
        //     res.ststus(500).send(error)
        // }

    //     User.find({}).then((users) => {
    //         res.send(users);
    //     }).catch((e) => {
    //         res.send(e);
    //     })
})


/**------------------------------------------------------------ */

// Get Specific User
// router.get("/users/:id", async(req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (user) {
//             return res.status(200).send(user)
//         }
//         res.status(404).send()
//     } catch (e) {
//         res.status(500).send(e)
//     }
//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send();
//     //     }
//     //     res.send(user);

//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

/*-------------------------------------------------------------------------------- */

// Update Users
router.patch("/users/me", auth, async(req, res) => {
    const Updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidateOperation = Updates.every((update) => allowedUpdates.includes(update));
    if (!isValidateOperation) {
        res.status(400).send({ error: 'invalid Update' });
    }
    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // const user = await User.findById(req.params.id);
        Updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error)
    }


})


// Delete Users
router.delete("/users/me", auth, async(req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id);

        // if (user) {
        //     return res.send(user)
        // }
        // res.status(404).send()

        await req.user.remove();
        res.send(req.user);

    } catch (error) {
        res.status(500).send(error)
    }
})



const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image"));
        }

        cb(undefined, true);
    }
})

// Create User avatar Upload Image

router.post("/users/me/avatar", auth, upload.single('avatar'), async(req, res) => {
    //req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({ width: 255, height: 255 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Delete User Avatar

router.delete("/users/me/avatar", auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send("Avatar has been deleted");
})


// get user Avatar
router.get("/users/:id/avatar", async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-Type", "image/png")
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})


module.exports = router;