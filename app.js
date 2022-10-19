const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const path = require('path');
const Campground = require('./models/campground');
const { error } = require('console');

const app = express();

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To 'fake' put/patch/delete requests:
app.use(methodOverride('_method'))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res)  => {
    res.render('home')
})

app.get('/campgrounds', async(req,res)  => {
  const campgrounds =  await Campground.find({})
  res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/:id', catchAsync(async(req,res)  => {
    let {id} = req.params
    const campground =  await Campground.findById(id)
    console.log(campground)
    res.render('campgrounds/show', {campground})
  }))

app.get("/new",  (req, res)=> {
    res.render('campgrounds/new')
})  

app.post('/campgrounds', catchAsync( async(req,res)  => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect('/campgrounds')
  }))

app.get("/campgrounds/:id/edit",  async (req, res)=> {
    const {id} = req.params
    console.log(`yep this is a edit request for product ${id}`)
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})

app.put("/campgrounds/:id",  catchAsync(async (req, res)=> {
    const { id } = req.params
    console.log(`let s go update campground ${id}`)
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    res.redirect('/campgrounds')
}))

app.delete("/campgrounds/:id",  async (req, res)=> {
    const { id } = req.params
    console.log(`let s go delete camp ${id}`)
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/Campgrounds')
})

app.all('*', (req,res,next) => {
  next(new ExpressError('Page Not Found',404))
})

app.use((err, req, res, next) => {
  const {statusCode = 500 } = err;
  if(!err.message) err.message = 'Oh no, something went wrong'
  res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

