const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ejs = require('ejs');

// pass the post value into this variable
// global scope to use it in app.get()
let newTodos = [];

// port            <li><%= todo %></li>
const port = 3000;

// creat app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// EJS doc: https://github.com/mde/ejs/wiki/Using-EJS-with-Express
app.set('view engine', 'ejs');

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
		today: currentDay,
		todos: newTodos // post request
	});
});

app.post('/', function(req, res) {
	newTodo = req.body.input;

	newTodos.push(newTodo);

	res.redirect('/');
});

app.listen(process.env.PORT || port, function(req, res) {
	console.log(`Server started at port: ${port}`);
});
