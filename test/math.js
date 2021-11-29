const { calculateTip, fahrenheitToCelcius, celciusToFahrenheit, add } = require('../src/math');

test('Should calculate total with tip ', () => {
    const total = calculateTip(10, .3);
    expect(total).toBe(13);
    // if (total !== 13) {
    //     throw new Error("Total should be 13. Got " + total);
    // }
})

test('Should calculate total with  default tip ', () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5);
})

// fahrenheitToCelcius
test("Should convert 32 F to 0 C", () => {
    const temp = fahrenheitToCelcius(32);
    expect(temp).toBe(0)
})

//celciusToFahrenheit
test("Should convert 0 C to 32 F", () => {
    const temp = celciusToFahrenheit(0);

    expect(temp).toBe(32);
})


// Async
// test("Async test demo", (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2);
//         done()
//     }, 2000);
// })



// Promise
test("Should add two Numbers", (done) => {
    add(3, 3).then((sum) => {
        expect(sum).toBe(6);
        done()
    })

})

// Async / await
test("Should add two numbers to use async/await", async() => {
    const sum = await add(12, 30)
    expect(sum).toBe(42);
})