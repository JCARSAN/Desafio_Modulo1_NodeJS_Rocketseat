class User{
    constructor(id,name,userName){
        this._id = id;
        this._name = name;
        this._userName = userName;
        this._todos = [];
    }
    getId(){
        return this._id;
    }
    getName(){
        return this._name;
    }
    getUserName(){
        return this._userName;
    }
    getTodos(){
        return this._todos;
    }
    addTodo(todo){
        this._todos.push(todo);
    }
    removeTodo(id){
        let removed = false;
        for(let index in this._todos){
            if(this._todos[index].getId() == id){
                this._todos.splice(index,1);
                removed = true;
                break;
            }
        }
        return removed;
    }
}

module.exports = User;