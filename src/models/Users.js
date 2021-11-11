class Users{
    constructor(){
        this._usersList = {}
    }
    addUser(user){
        this._usersList[user.getUserName()] = user;
    }
    getUsersList(username){
        return this._usersList[username];
    }
}

module.exports = new Users();