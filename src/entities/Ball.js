import {Drawable} from "../interface/Drawable.js";
import {addTickable, getColliders} from "../libs/StorageLibs.js";

export class Ball extends Drawable {
    constructor(props = {}) {
        super(props);
        this.size = {width: 16, height: 16};
        this.direction = {x: 2, y: 2};
        this.border = props.border ? props.border : 4;
        addTickable(this);
    }

    draw() {
        this.getContext().beginPath();
        this.getContext().arc(this.getAdaptivePosition().x, this.getAdaptivePosition().y, (this.getAdaptiveSize().width + this.getAdaptiveSize().height) / 2, 0, 2 * Math.PI, false);
        this.getContext().fillStyle = 'green';
        this.getContext().fill();
        this.getContext().lineWidth = 5;
        this.getContext().strokeStyle = '#434343';
        this.getContext().fillStyle = "#262626"
        this.getContext().stroke();
        this.getContext().fill();
    }

    tickEvent() {
        const colliders = getColliders();
        const speed = document.field.getSize().width / 400;

        for (let i = 0; i < Object.keys(colliders).length; i++) {
            const key = Object.keys(colliders)[i];
            const collider = colliders[key];
            const collideVector = collider.collide(this);

            if (collideVector) {
                const norm = Math.sqrt(collideVector.x * collideVector.x + collideVector.y * collideVector.y);
                this.direction = {x: collideVector.x * speed / norm, y: collideVector.y * speed / norm};
                break;
            }
        }

        if(this.position.y > document.field.getSize().height / 2 + 64){
            document.field.stopGame();
        }

        this.position = this.getNextPosition();
    }

    getNextPosition(){
        return {x: this.position.x + this.direction.x, y: this.position.y - this.direction.y};
    }
}