const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();


/*    Tasks Colllecton With API  */

// Create Tasks
router.post("/tasks", auth, async(req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);

    } catch (e) {
        res.status(500).send(e);
    }

    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})


// Get All Task ,,

// GET /task?completed= true
// GET /task?limit=2&skip=10
// GET /task?sortBy=createdAt:desc or asc
router.get("/tasks", auth, async(req, res) => {
        const match = {};
        const sort = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        try {
            //const task = await Task.find({});
            // const task = await Task.find({ owner: req.user._id })
            await req.user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            })
            res.send(req.user.tasks);

        } catch (e) {
            res.status(500).send(e)
        }
        // Task.find({}).then((tasks) => {
        //     res.send(tasks)
        // }).catch((e) => {
        //     res.send(e);
        // })
    })
    // Get Specific Task
router.get("/tasks/:id", auth, async(req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (task) {
            return res.send(task);
        }
        res.status(404).send()
    } catch (e) {
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task) => {
    //     if (task) {
    //         return res.send(task);
    //     }
    //     res.status(404).send();
    // }).catch((e) => {
    //     res.status(500).send();
    // })
})

// Update Task
router.patch("/tasks/:id", auth, async(req, res) => {
    const Updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidateOperation = Updates.every((update) => allowedUpdates.includes(update));
    if (!isValidateOperation) {
        return res.status(400).send({ error: 'invalid Update' })
    }

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        Updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error)

    }
})


// Delete Tasks
router.delete("/tasks/:id", auth, async(req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id });

        if (task) {
            return res.send(task);
        }
        res.status(404).send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;