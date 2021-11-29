const app = require('./app')
require('./db/mongoose');

const port = process.env.PORT || 3000  

app.listen(port, () => {
    console.log('server is up on port ', port);
}) 

//Middleware new request => do something => run  route handler
// app.use((req, res, next) => {
//     if (req.method === "GET") {
//         res.status(503).send("Try Your request");
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send("Site is currently down! Check back soon ")
// })

// // password Hash in Example For Test

// const jwt = require('jsonwebtoken');

// const myFunction = async() => {
//     const token = jwt.sign({ _id: 'abc1234' }, 'thisisnewcourses', { expiresIn: '1 week' });
//     console.log(token);

//     const data = jwt.verify(token, 'thisisnewcourses');
//     console.log(data);
//     // const password = "Qadar1122";
//     // const hashPassword = await bcrypt.hash(password, 8);

//     // console.log(password);
//     // console.log(hashPassword);

//     // const isMatch = await bcrypt.compare(password, hashPassword);
//     // console.log(isMatch);
// }

// myFunction();

// const pet = {
//     name: "Hel"
// }
// console.log(JSON.stringify(pet));

const Task = require('./models/task');
const User = require('./models/user');

const main = async() => {
    // const task = await Task.findById('618bcfbf318ed4639de371e5');
    // await task.populate('owner')
    // console.log(task.owner);

    const user = await User.findById('618bcf7f318ed4639de371da');
    await user.populate('tasks');
    console.log(user.tasks);
}
main();



// // Upload Image Into The File
// const multer = require("multer");

// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error("please upload a Word document"));
//         }
//         cb(undefined, true)
//     }

// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })