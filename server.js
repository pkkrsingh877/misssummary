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
    },
    // category: {
    //     type: String
    // },
    tags: [String],
    readMinutes: Number,
    createdAt: {
        type: Date
    },
    modifiedAt: {
        type: Date
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
    let minutes = readMinutes(newDescription);
    const { id } = req.params;
    const data = await Summary.findByIdAndUpdate(id, {
        title: newTitle,
        description: newDescription,
        modifiedAt: new Date(),
        readMinutes: minutes
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

app.post('/admin', async (req, res) => {
    const { title, description } = req.body;
    let minutes = readMinutes(description);
    await Summary.create({
        title: title, 
        description: description, 
        createdAt: new Date(), 
        modifiedAt: new Date(),
        readMinutes: minutes
    });
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
    /* Since it's a get request i'm making the 
    description in database should not change 
    */ 
    for(let i = 0; i < data.length; i++){
        let newStr = getNewDescription(data[i].description);
        data[i].description = newStr;
    }
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

const findAll = async () => {
    const doc = await Summary.find({});
    return doc;
}

const readMinutes = (str) => {
    //counting number of words in description
    let count = 1
    for(let i=0; i< str.length; i++){
        if(str[i] === " "){
            count++;
        }
    }
    let minutes = Math.ceil(count/180);
    return minutes;
}

const getNewDescription = (str) => {
    //counting number of words in description
    let count = 1
    let j = 0;
    for(let i=0; i< str.length; i++){
        if(str[i] === " "){
            count++; 
            if(count === 46){
              j = i;
            }
        }
    }
    return str.slice(0, j);
}

const countHtmlTags = (str) => {
    const arr=[]
    for(let i = 0; i< str.length; i++){
        if(str[i] == '<'){
            let j = i;
            let temp = "";
            while(str[j] != '>'){
            temp = temp + str[j];
            j++;
            }
            if(temp != ""){
            temp = temp + ">";
            arr.push(temp);
            }
        }
    }
    return arr.length;
} 