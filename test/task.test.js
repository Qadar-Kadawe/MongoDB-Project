const request = require("supertest")
const jwt = require("jsonwebtoken");
const app = require("../src/app")
const Task = require("../src/models/task")
const {
    userOne,
    userOneId,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDabatabase
} = require("./fixtures/db");

beforeEach(setupDabatabase)

test("Should a create task for user", async() => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From a New Testing'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

// Challenge Fetch All users task
test("Should fetch all user task", async() => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)

})

//Chllenge Not Delete Other Users tasks

test("Should  delete  users tasks", async() => {
    const resposne = await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
        // const task = await Task.findById(taskThree._id)
        // expect(task).not.toBeNull()
})