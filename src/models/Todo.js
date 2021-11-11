class Todo{
    constructor(id,title,deadline){
        this._id = id;
        this._title = title;
        this._done = false;
        this._created_at = new Date(Date.now());
        this._deadline = new Date(deadline);
    }
    getId(){
        return this._id;
    }
    getTitle(){
        return this._title;
    }
    setTitle(title){
        this._title = title;
    }
    getDone(){
        return this._done;
    }
    getDateCreated(){
        return this._created_at;
    }
    setDone(bool){
        this._done = bool;
    }
    getDeadline(){
        return this._deadline;
    }
    setDeadline(date){
        this._deadline = new Date(date);
    }
}

module.exports = Todo;