import {Block} from "../entities/Block.js";

export class Drawable {

    constructor(props = {}) {
        this.position = props.position ? props.position : {x: 0, y: 0};
        this.size = props.size ? props.size : {width: 100, height: 100};
        this.rotation = props.rotation ? props.rotation : 0;
    }

    draw() {
    }

    preDraw(){
    }

    getPosition() {
        return this.position;
    }

    getSize() {
        return this.size;
    }

    getRotation() {
        return this.rotation;
    }

    getContext() {
        if (!document.context2D) {
            document.context2D = document.getElementsByTagName("canvas")[0].getContext("2d");
        }
        return document.context2D;
    }

    getAdaptiveSize() {
        const scale = (window.innerWidth / document.field.getSize().width) * document.field.getDensity();
        return {width: this.getSize().width * scale, height: this.getSize().height * scale};
    }

    getAdaptivePosition() {
        const scale = (window.innerWidth / document.field.getSize().width) * document.field.getDensity();
        return {x: this.getPosition().x * scale, y: this.getPosition().y * scale};
    }

    getUID() {
        if (!this.uid) {
            this.uid = Math.random().toString(36).substring(2, 15);
        }
        return this.uid;
    }
}