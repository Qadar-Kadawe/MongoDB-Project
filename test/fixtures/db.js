const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user")
const Task = require("../../src/models/task")


const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Muno",
    email: "Muno@gmail.com",
    password: "muno-142",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, 'thisisnewcourses')
    }]
}
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "Xanan",
    email: "Xanan143@gmail.com",
    password: "hanan1122",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, 'thisisnewcourses')
    }]
}

// Tasks 1
const taskOne = {
        _id: new mongoose.Types.ObjectId(),
        description: 'first task',
        completed: false,
        owner: userOne._id
    }
    // Tasks 2
const taskTwo = {
        _id: new mongoose.Types.ObjectId(),
        description: 'second task',
        completed: false,
        owner: userOne._id
    }
    // Tasks 3

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
}


const setupDabatabase = async() => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDabatabase
}