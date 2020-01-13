const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ejs = require('ejs');

// pass the post value into this variable
// global scope to use it in app.get()
let homeItems = [];
let workItems = [];

// port
const port = 3000;

// creat app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// EJS doc: https://github.com/mde/ejs/wiki/Using-EJS-with-Express
app.set('view engine', 'ejs');

// home route
app.get('/', function(req, res) {
	// get the current day
	const options = {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	};
	const date = new Date();
	const currentDay = date.toLocaleDateString('en-GB', options);

	res.render('list', {
		listTitle: currentDay,
		todos: homeItems // post request
	});
});

// get the posted data from the form and redirct to the right route
app.post('/', function(req, res) {
	console.log(req.body);
	newTodo = req.body.input;

	if (req.body.list === 'Work') {
		workItems.push(newTodo);
		res.redirect('/work');
	} else {
		homeItems.push(newTodo);
		res.redirect('/');
	}
});

// work route
app.get('/work', function(req, res) {
	const list = 'Work';

	res.render('list', {
		listTitle: list,
		todos: workItems // post request
	});
});

// port

app.listen(process.env.PORT || port, function(req, res) {
	console.log(`Server started at port: ${port}`);
});
