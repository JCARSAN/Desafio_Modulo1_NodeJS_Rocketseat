const express = require('express');
const cors = require('cors');
const Todo = require('./models/Todo');
const User = require('./models/User');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// const users = [];
const usersList = require('./models/Users');

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  if(!usersList.getUsersList(username)){
    return response.status(400).send({error: "User not found!"});
  }
  request.username = username;
  next();
}

app.post('/users', (request, response) => {
    const { name, username } = request.body;
    const todosList = usersList.getUsersList(username);
    if(todosList){
       return response.status(400).json({error : "User already exists!"});
    }
    const user = new User(uuidv4(),name,username);
    usersList.addUser(user);
    response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => { 
    const { username } = request;
    const listTodos = usersList.getUsersList(username);
    return response.status(200).json(listTodos.getTodos());
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
    const { username } = request;
    const { title, deadline } = request.body;
    const todo = new Todo(uuidv4(),title,deadline+" 00:00:00");
    const usersTodos = usersList.getUsersList(username);
    usersTodos.addTodo(todo);
    response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { id } = request.params;
    const { title, deadline } = request.body;
    const { username } = request;
    const todosList = usersList.getUsersList(username).getTodos();
    let todoExists = false;
    for(let index in todosList){
      if(todosList[index].getId() == id){
        todosList[index].setDeadline(new Date(deadline+" 00:00:00"));
        todosList[index].setTitle(title);
        todoExists = true;
        break;   
      }
    }
    if(todoExists){
      return response.status(204).send(); 
    }
    return response.status(404).send({error: "Todo not exists"});
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    const { id } = request.params;
    const { username } = request;
    const todosList = usersList.getUsersList(username).getTodos();
    let todoExists = false;
    for(let index in todosList){
      if(todosList[index].getId() == id){
        todosList[index].setDone(true);
        todoExists = true; 
        break;
      }
    }
    if(todoExists){
        return response.status(204).send(); 
    }
    return response.status(404).send({error: "Todo not exists"});
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { id } = request.params;
    const { username } = request;
    const removed = usersList.getUsersList(username).removeTodo(id);
    if(removed){
        return response.status(204).send();  
    }
    return response.status(404).send({error: "Todo not exists"});
});

module.exports = app;