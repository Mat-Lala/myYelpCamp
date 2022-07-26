const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

const app = express();

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res)  => {
    res.render('home')
})

app.get('/campgrounds', async(req,res)  => {
  const campgrounds =  await Campground.find({})
  res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/:id', async(req,res)  => {
    let {id} = req.params
    const campground =  await Campground.findById(id)
    console.log(campground)
    res.render('campgrounds/show', {campground})
  })

app.get("/new",  (req, res)=> {
    res.render('campgrounds/new')
})  

app.post('/campgrounds', async(req,res)  => {
    console.log(req.body)
    const newCampground = new Campground(req.body);
    const campgrounds = await newCampground.save();
    res.redirect('/campgrounds')
  })

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

