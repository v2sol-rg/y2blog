const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      cors = require('cors')
      port = 8080;

const { v4: uuidv4 } = require('uuid');


// place holder for the data json
// var users = require('./db/data.json');
var books = require('./db/booklist.json');
var loginUsers = require('./db/login.json');
var tasks = require('./db/tasks.json');


app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, './reactrgapp/build/')));

app.get('/', (req,res) => {
  res.sendFile('./reactrgapp/build/index.html')
  res.sendFile(path.join(__dirname, './reactrgapp/build/index.html'));
});

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

// TASK RELATED

app.post('/admin/requestjob', (req, res) => {  
  fs.readFile("./db/tasks.json", function(err, data) {       
    // Check for errors 
    if (err) throw err; 
    tasks = JSON.parse(data); 
  });
  const requestNew = req.body;
  requestNew['id'] = uuidv4();

  tasks.push(requestNew)
  console.log(tasks)

  fs.writeFile("./db/tasks.json", JSON.stringify(tasks), err => { 
    // Checking for errors 
    if (err) throw err; 
  });
  res.json(tasks); 
})

app.delete('/admin/requestjob/:id', (req, res) => {  
  fs.readFile("./db/tasks.json", function(err, data) {       
    // Check for errors 
    if (err) throw err; 
    tasks = JSON.parse(data); 
  });
  const idToRemove = id;

  const requestNew = req.body;
  const finalTaskArray = requestNew.filter(obj => obj.id !== idToRemove);

  fs.writeFile("./db/tasks.json", JSON.stringify(finalTaskArray), err => { 
    // Checking for errors 
    if (err) throw err; 
  });
  res.json(finalTaskArray); 
})




app.get('/admin/requestjob', async (req, res) => {
  fs.readFile("./db/tasks.json", function(err, data) {       
    // Check for errors 
    if (err) throw err;    
    // Converting to JSON 
    tasks = JSON.parse(data); 
  });
  //const booksObj = await tasks.filter((ts) =>  ts.id == req.params.id)
  res.json(tasks);
});



app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});