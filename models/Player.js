class Player {
    constructor(id, name, posx, posy) {
        this.id = id;
        this.name = name;
        this.pos_x = posx;
        this.pos_y = posy;
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            pos_x: this.pos_x,
            pos_y: this.pos_y
        };
    }

    static fromJson(json) {
        const { id, name, pos_x, pos_y } = json;
        return new Player(id, name, pos_x, pos_y);
    }
}

module.exports = Player;