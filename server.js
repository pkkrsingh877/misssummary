const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 3000;
const methodOverride = require('method-override')
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
require('dotenv').config();

//middleware (order matters )
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

//requiring files
const summaryRoutes = require('./routes/summary');
app.use('/summary', summaryRoutes);
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

//setting up mongodb
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => {
    console.log("DB Connection Successful!")
})
.catch((error) => {
    console.log(error);
});

//setting up ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.use((req, res) => {
    res.send('Not Found!');
});

app.listen(port, () => {
    console.log('App listening at port', port);
});

