const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Dot Env
dotenv.config();

// MONGODB CONNECTION
connectDB();

// Rest Object
const app = express();

app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middlewares
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true
// }));

app.use(express.json());
app.use(morgan('dev'));

// Static Files
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/DataTest', express.static(path.join(__dirname, 'DataTest')));

// Routes
app.use('/api/v1/auth', require('./routes/userRoute'));
app.use('/api/v1/upload', require('./routes/uploadRoute'));


app.get("/", (req, res) => {
    res.status(200).send({
        success: true,
        message: "Welcome to BedroomMagic Application"
    });
});

// PORT
const PORT = process.env.PORT || 8080;

// Listen
app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`.bgGreen.white);
})