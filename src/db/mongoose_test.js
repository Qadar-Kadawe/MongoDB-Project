const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/test-api-test", {
    useNewUrlParser: true

})