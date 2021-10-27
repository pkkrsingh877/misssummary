const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 3000;
const methodOverride = require('method-override')
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
require('dotenv').config();

//setting up mongodb
mongoose.connect(process.env.MONGO_URI,
  {
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

//create schema
const summarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
//create model
const Summary = new mongoose.model('Summary', summarySchema);

//setting up ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

//routes
app.patch('/admin/list/:id', async (req, res) => {
    const { title, description } = req.body;
    let newTitle = title;
    let newDescription = description;
    const { id } = req.params;
    const data = await Summary.findByIdAndUpdate(id, {
        title: newTitle,
        description: newDescription
    },
    {
        new: true,
        upsert: true
    }
    );
    res.redirect('/admin/list');
});

app.get('/admin/list/edit/:id', async (req, res) => {
    const { id } = req.params;
    const data = await Summary.findById(id);
    res.render('admin/edit', { data });
});

app.delete('/admin/list/:id', async (req, res) => {
    const { id } = req.params;
    await Summary.findByIdAndDelete(id);
    res.redirect('/admin/list');
});

app.get('/admin/list', async (req, res) => {
    const data = await Summary.find({});
    res.render('admin/list', { data });
});

app.post('/admin', (req, res) => {
    const { title, description } = req.body;
    create(title, description);
    res.redirect('admin')
});

app.get('/admin/new', (req, res) => {
    res.render('admin/new');
});

app.get('/admin', (req, res) => {
    res.render('admin/index');
});

app.get('/summary/:id', async (req, res) => {
    const { id } = req.params;
    const data = await Summary.findById(id);
    res.render('summary/show', { data });
});

app.get('/summary', async (req, res) => {
    const data = await findAll();
    res.render('summary/index', { data });
});

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

//functions

const create = async (title, description) => {
    await Summary.create({ 
        title: title,
        description: description 
    });
}

const findAll = async () => {
    const doc = await Summary.find({});
    return doc;
}

