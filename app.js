const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ejs = require('ejs');
const mongoose = require('mongoose');



// port
const port = 3000;

// creat app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// EJS doc: https://github.com/mde/ejs/wiki/Using-EJS-with-Express
app.set('view engine', 'ejs');


// include mongoose in our project and open a connection to the particular database
// db will be auto created
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true , useUnifiedTopology: true });

// get notified if we connect successfully or if a connection error occurs:
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(" we're connected!")
});

// create a schema for the todo items
const itemSchema = new mongoose.Schema({
	name: String,
});

// create a Model from itemSchema
const Item = mongoose.model("Item", itemSchema);

// create new items / documents 
const todo1 = new Item({
	name: "Learn backend",
});
const todo2 = new Item({
	name: "eat",
});
const todo3 = new Item({
	name: "relax",
});

// create array with the default values in our todo
const defaultArray = [todo1, todo2, todo3];


// home route
app.get('/', function(req, res) {

		Item.find({}, function (err, docs){

			if(docs.length === 0 ){
				Item.insertMany(defaultArray, function(error, docs) {
					if(error){
						console.log("oeeps", error)
					}else{
						console.log("Succesfully inserted default values to listitemsDB")
					}
				});
				res.redirect("/");
			}
			else{
				res.render('list', {
					listTitle: 'Today',
					todos: docs // post request
				});
			}
		});
});

// get the posted data from the input form and redirct to the right route
app.post('/', function(req, res) {
	console.log(req.body);
	let newTodo = new Item({name: req.body.input});

	newTodo.save()
	
	res.redirect("/");
});


// get the posted data from the input form and redirct to the right route
app.post('/delete', function(req, res) {
		const checkedItemID = req.body.checkbox;
		console.log(checkedItemID);

		Item.findOneAndRemove({ _id: checkedItemID }, function(err){
			if(err){
				console.log(err)
			}else{
				console.log("succesful detelet item")
			}

			res.redirect("/");
		})
});

// work route
app.get('/work', function(req, res) {
	const list = 'Work';

	res.render('list', {
		listTitle: list,
		todos: defaultArray // post request
	});
});

// port

app.listen(process.env.PORT || port, function(req, res) {
	console.log(`Server started at port: ${port}`);
});
