import {Block} from "./Block.js";
import {addTickable, startTickEvent} from "../libs/StorageLibs.js";
import {Platform} from "./Platform.js";
import {Ball} from "./Ball.js";

export class Field {
    size = {width: 1920, height: 1024, rows: 20, columns: 4}

    constructor(props = {}) {
        this.setCanvasSize();
        window.addEventListener("resize", (event) => {
            this.setCanvasSize();
        });
        document.field = this;
        this.bindControl();
        startTickEvent().then();
        addTickable(this);
    }

    addElement(element) {
        this.getElements().push(element);
        element.draw();
    }

    getElements() {
        if (!this.elements) {
            this.elements = [];
        }

        return this.elements;
    }

    deleteAllElements() {
        this.elements = [];
    }

    drawElements() {
        this.clearField();
        this.getElements().forEach(element => {
            if (typeof element.preDraw === 'function') {
                element.preDraw();
            }
        });
        this.getElements().forEach(element => {
            if (typeof element.draw === 'function') {
                element.draw();
            }
        });
    }

    clearField() {
        const context = this.getCanvas().getContext('2d');
        context.clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);
    }

    setCanvasSize() {
        this.getCanvas().width = `${window.innerWidth * this.getDensity()}`;
        this.getCanvas().height = `${window.innerHeight * this.getDensity()}`;
        this.drawElements();
    }


    getCanvas() {
        const canvas = document.getElementById("main-canvas");
        return canvas;
    }


    getDensity() {
        return 2.0;
    }

    getSize() {
        return this.size;
    }

    generateFiledFromPattern(pattern) {
        this.deleteAllElements();
        this.addBorders();
        this.addElement(new Ball({position: {x: this.getSize().width / 2, y: this.getSize().height / 2 - 64}}));
        this.addElement(new Platform({position: {x: this.getSize().width / 2, y: this.getSize().height / 2}}));
        const size = {
            width: this.getSize().width / this.getSize().rows,
            height: this.getSize().width / this.getSize().rows * 0.4
        };
        const blockExample = new Block({size: size});
        const blockSize = blockExample.getSize();
        for (let x = 0; x < this.getSize().rows / 2; x++) {
            for (let y = 0; y < pattern.length; y++) {
                const rowL = pattern[pattern.length - y - 1];
                const positionL = {
                    x: blockSize.width * (x - this.size.rows / 2) + this.getSize().width / 2,
                    y: blockSize.height * (pattern.length - y - 1)
                };
                const blockL = new Block({
                    collidable: true,
                    size: size,
                    field: this,
                    position: positionL,
                    type: rowL[x]
                });
                this.addElement(blockL);
                const rowR = pattern[pattern.length - y - 1];
                const positionR = {
                    x: blockSize.width * ((this.getSize().rows - x - 1) - this.size.rows / 2) + this.getSize().width / 2,
                    y: blockSize.height * (pattern.length - y - 1)
                };
                const blockR = new Block({
                    collidable: true,
                    size: size,
                    field: this,
                    position: positionR,
                    type: rowR[this.getSize().rows - x - 1]
                });
                this.addElement(blockR);
            }

        }

        this.drawElements();
    }

    bindControl() {
        document.pressedKeys = {};

        document.addEventListener("keydown", (event) => {
            document.pressedKeys[event.keyCode] = true;
        });

        document.addEventListener("keyup", (event) => {
            document.pressedKeys[event.keyCode] = false;
        });
    }


    tickEvent() {
        this.drawElements();
    }

    getUID() {
        if (!this.uid) {
            this.uid = Math.random().toString(36).substring(2, 15);
        }
        return this.uid;
    }

    addBorders() {
        this.addElement(new Block({
            collidable: true,
            type: "!",
            size: {width: 20, height: this.getSize().height},
            position: {x: -20, y: 0}
        }));
        this.addElement(new Block({
            collidable: true,
            type: "!",
            size: {width: 20, height: this.getSize().height},
            position: {x: this.getSize().width, y: 0}
        }));
        this.addElement(new Block({
            collidable: true,
            type: "!",
            size: {width: this.getSize().width, height: 20},
            position: {x: 0, y: -20}
        }));
        this.addElement(new Block({
            collidable: true,
            type: "!",
            size: {width: this.getSize().width, height: 20},
            position: {x: 0, y: this.getSize().height - 300}
        }));
    }

    stopGame(){
        this.deleteAllElements();
        this.clearField();
    }

}