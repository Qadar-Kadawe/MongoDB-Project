const request = require('supertest');
const { userOne, userOneId, setupDabatabase } = require("./fixtures/db")
const app = require("../src/app");
const User = require("../src/models/user")

// Create Object For Using beforeEach

beforeEach(setupDabatabase)


// Create New User using Test

test("Should signup a new user", async() => {
    const response = await request(app).post("/users").send({
        name: "qadar",
        email: "qadar2020@gmail.com",
        password: "pass112233"
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertion About Response
    expect(response.body).toMatchObject({
        user: {
            name: 'qadar',
            email: 'qadar2020@gmail.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('pass112233')
})


// User Login Using Test

test("Should login existing user", async() => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOne)
    expect(response.body.token).toBe(user.tokens[1].token)
})

// Challenge Time
// test("Should not login nonExisting user",async()=>{
//     await request(app).post("/users/login").send({
//         email:userOne.email,
//         password:userOne.password
//     }).expect(200)
// })


// Authorization Users test
test("Should get profile for user", async() => {
    await request(app)
        .get("/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

// UnAuthorization Users test
test("Should get profile for user unAuthencated", async() => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)

})

//delete authorization user
test("Should delete account for user", async() => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

// delete Unauthorization user
test("Should not delete account for unauthenticated user", async() => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

//Profile upload image

test("Should upload avatar profile for image", async() => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/Profile.png')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

//Challenge Upadate Name

test("Should update valid user feilds", async() => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'filsan'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('filsan')
})

// Update Imail
test("Should update valid user fields", async() => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({ email: 'filsan143@gmail.com' })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.email).toEqual('filsan143@gmail.com')
})

// Not Updated user
test("Should not update invalid user fields", async() => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Somalia' })
        .expect(400)
})