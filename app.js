const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');




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

// create array with the default values in our todo
const defaultArray = [todo1];


// schema for diffrent todo lists
const listSchema = new mongoose.Schema({
	name: String,
	items: [itemSchema]
});

// create a List model that uses the listSchema 
const List = mongoose.model("List", listSchema);



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
					todos: docs 
				});
			}
		});
});

// get the posted data from the input form and redirct to the right route
app.post('/', function(req, res) {

	const listName = req.body.list;
	let newTodo = new Item({name: req.body.input});


	if(listName === "Today"){
		newTodo.save()
		res.redirect("/");
	}else{
		List.findOne({name: listName}, function(err, foundList){
			foundList.items.push(newTodo);
			foundList.save()
			res.redirect("/" + listName)
		});
	}
});


// get the posted data from the input form and redirct to the right route
app.post('/delete', function(req, res) {
	
	// item's id
	const checkedItemID = req.body.checkbox;

	// item's list
	const listName = req.body.listName;

	if(listName === "Today"){
		Item.findOneAndRemove({ _id: checkedItemID }, function(err){
			if(err){
				console.log(err)
			}else{
				console.log("succesful detelet item")
			}
	
			res.redirect("/");
		})
	}else{
		List.findOneAndUpdate({name: listName}, {$pull:{items:{_id: checkedItemID }}}, function(err, foundList){
			if(!err){
				res.redirect("/" + listName)
			}else{
				console.log(err)
			}

		});
	}
});

// custom routes
app.get('/:listName', function(req, res) {
	const customListName = _.capitalize(req.params.listName);



	List.findOne({ name: customListName }, function (err, list) {
		if(!err){
			if(list){
				// show list if it exist
				res.render('list', {
					listTitle: list.name,
					todos: list.items 
				});
			}else{
				// crate list if it doesnt exist
				// creat a list
				const list = new List({
					name: customListName,
					items: defaultArray
				});

				list.save();
				res.redirect("/" + customListName)
			}

		}else{
			console.log(err);
		}
	});

});

// port

app.listen(process.env.PORT || port, function(req, res) {
	console.log(`Server started at port: ${port}`);
});
