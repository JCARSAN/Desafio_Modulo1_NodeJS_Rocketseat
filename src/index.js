const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
    const { username } = request.headers;
    const userExists = users.find((user) => { return user.username == username});
    if(!userExists){
      return response.status(400).json({error: "User not exists!"});
    }
    request.username = username;
    next();
}

app.post('/users', (request, response) => {
    const { name, username } = request.body;
    const id = uuidv4();
    const user = {
      id: id,
      name,
      username,
      todos: []
    }
    let userAlreadyExists = users.find((user) => { return user.username == username});
    if(userAlreadyExists){
      return response.status(400).json({ error: "User already exists!"});
    }
    users.push(user);
    return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => { 
    const { username } = request;
    const user = users.find((user) => { return user.username = username});
    return response.status(200).send(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
    const { username } = request;
    const { title,deadline } = request.body;
    const todo = {
      id: uuidv4(),
      title,
      done: false,
      deadline: new Date(deadline),
      created_at: new Date()
    }
    const user = users.find((user) => { return user.username = username});
    user.todos.push(todo);
    response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { username } = request;
    const { id } = request.params;
    const { title, deadline } = request.body;
    const user = users.find((user) => { return user.username = username});
    const todo = user.todos.filter((todo) => { return todo.id == id})[0];
    if(!todo){
      return response.status(404).json({ error: "Todo not exists"});
    }
    todo.title = title;
    todo.deadline = new Date(deadline);
    return response.status(200).send(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    const { username } = request;
    const { id } = request.params;
    const { title, deadline } = request.body;
    const user = users.find((user) => { return user.username = username});
    const todo = user.todos.filter((todo) => { return todo.id == id})[0];
    if(!todo){
      return response.status(404).json({error: "Todo not exists"});
    }
    todo.done = true;
    return response.status(200).send(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { username } = request;
    const { id } = request.params;
    const user = users.find((user) => { return user.username == username});
    const todoIndex = user.todos.findIndex((todo) => { return todo.id == id });
    if(todoIndex == -1){
      return response.status(404).json({error: "Todo not exists"});
    }
    user.todos.splice(todoIndex,1);
    return response.status(204).send();
});

module.exports = app;