const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials : true
}));
require('dotenv').config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const dbConnection = require('./dbConnection');
dbConnection();

//Route imports
const userRoute = require('./routes/user');
const planRoute = require('./routes/plan');
const expenseRoute = require('./routes/expense');
const openAIRoute = require('./controllers/openAI');

// Routes
app.use('/user', userRoute);
app.use('/plan', planRoute);
app.use('/expense', expenseRoute);
app.use('/', openAIRoute);

app.listen(process.env.PORT, ()=>{
    console.log("Server is running");
})