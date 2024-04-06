module.exports = class GameGeneral {
    users = {}

    constructor(users = {}){
        this.users = users;
    }


    getUsers() {
        return this.users;
    }

    getUsersJson() {
        const usersJson = {};

        for (const userId in this.users) {
            const user = this.users[userId];
            usersJson[userId] = user.toJson();
        }

        return usersJson;
    }

    getUser(id){
        return this.users[id];
    }

    addUser(player){
        // reemplazar o agregar usuario
        this.users[player.id] = player;
    }

    removeUser(id){
        delete this.users[id];
    }
}