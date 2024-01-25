const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      cors = require('cors')
      port = 8080;


// place holder for the data json
// var users = require('./db/data.json');
var books = require('./db/booklist.json');
var loginUsers = require('./db/login.json');


app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../colab/build')));

app.get('/api/books', (req, res) => {
  fs.readFile("./db/booklist.json", function(err, data) {       
    // Check for errors 
    if (err) throw err;    
    // Converting to JSON 
    books = JSON.parse(data); 
  });
  res.json(books);
});

app.get('/api/books/:id', async (req, res) => {
  fs.readFile("./db/booklist.json", function(err, data) {       
    // Check for errors 
    if (err) throw err;    
    // Converting to JSON 
    books = JSON.parse(data); 
  });
  const booksObj = await books.filter((bk) =>  bk.id == req.params.id)
  res.json(booksObj);
});


app.post('/login', (req, res) => {
  fs.readFile("./db/login.json", function(err, data) {       
    // Check for errors 
    if (err) throw err; 
    loginUsers = JSON.parse(data); 
  });
  var availableUser = loginUsers.find((lu) => lu.username === req.body.username)
  
  if(availableUser) {
    loginUsers = loginUsers.filter((obj) => obj.username !== availableUser.username);    
  }
  loginUsers.push(req.body)
    fs.writeFile("./db/login.json", JSON.stringify(loginUsers), err => { 
      // Checking for errors 
      if (err) throw err; 
    });
    res.json("Login success!");  
});

app.patch('/updatebook', (req, res) => {
  fs.readFile("./db/booklist.json", function(err, data) {       
    // Check for errors 
    if (err) throw err; 
    books = JSON.parse(data); 
  });
  books.forEach((boo) => {
    if(boo.id === req.body.id) {
      boo['story'] = req.body.story
      boo['genre'] = req.body.genre
    }
  })
  console.log(books)
  
  fs.writeFile("./db/booklist.json", JSON.stringify(books), err => { 
    // Checking for errors 
    if (err) throw err; 
  });
    res.json("updated records");  
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './reactrgapp/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});