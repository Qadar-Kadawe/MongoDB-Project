require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('617fd343b19a0ccd2df4a29a', { age: 20 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 20 })
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// })

const updateAgeAndCount = async(id, age) => {
    await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count

}

updateAgeAndCount('617fd308d87167bccd623e7d', 12).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})