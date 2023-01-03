const express = require('express')
const app = express();
const PORT = 5001;
const mongoose = require('mongoose')
const {MONGO_URI} = require('./db')
const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:3000',
	optionsSuccessStatus: 200
}))


const middlware = (req, res, next) => {
    console.log("Middleware executed");
    next()
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB")
})
mongoose.connection.on("error", (err) => {
    console.log('Connecttion error ', err);
})
app.use(middlware)
app.get('/', middlware, (req, res) => {
    console.log("Working");
    res.send("Hello World!")
});

require("./models/user")
require("./models/posts")

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
// app.use(require('./routes/user'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})