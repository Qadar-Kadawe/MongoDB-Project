require('../src/db/mongoose');
const Task = require('../src/models/task');

// CHALLENGE TASK PROMISE_CHAINING
// Task.findByIdAndDelete('617ff71dc7dd4fbec534b598').then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: true })
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// })


// Delete Using Async/await
const deleteTaskAndCount = async(id) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('6180b676f7fadcd375fa848f').then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})