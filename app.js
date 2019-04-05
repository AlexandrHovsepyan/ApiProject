const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
app.use(helmet());

mongoose.connect("mongodb://apiproject:"+ process.env.MONGO_ATLAS_PW +"@apiproject-shard-00-00-pdtdf.mongodb.net:27017,apiproject-shard-00-01-pdtdf.mongodb.net:27017,apiproject-shard-00-02-pdtdf.mongodb.net:27017/test?ssl=true&replicaSet=apiproject-shard-0&authSource=admin&retryWrites=true",{
     useNewUrlParser: true, 
     useCreateIndex: true,
     useFindAndModify: false 
});

const usersRoutes = require('./routes/users'); 
const carsRouter = require('./routes/cars');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req,res,next) => {
    res.status(200).json({
        message: "You requested index page"
    });
})

app.use('/users',usersRoutes);
app.use('/cars',carsRouter);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
app.use((err,req,res,next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        error: {
            message: error.message,
            place: "app.js"
        }
    });
    console.error(err);
});
const port = app.get('port') || 3000;

app.listen(port, () => console.log(`Server is listening on port ${port}`));