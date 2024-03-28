import {Drawable} from "../interface/Drawable.js";
import {addCollider, addTickable} from "../libs/StorageLibs.js";
import {averageHexColor} from "../libs/ColorLib.js";

export class Platform extends Drawable {
    constructor(props = {}) {
        super(props);
        this.size = {width: 300, height: 20};
        this.border = props.border ? props.border : 4;
        this.padding = props.padding ? props.padding : 2;
        addCollider(this);
        addTickable(this);
        this.color = "#464646";
    }


    draw() {
        if (this.destroyed || this.type === "_") {
            return;
        }
        this.draw2D();
    }

    preDraw() {
        if (this.destroyed || this.type === "_") {
            return;
        }
        this.draw3D();
    }


    draw3D() {
        const ctx = this.getContext();
        let pos = this.getAdaptivePosition();
        const size = this.getAdaptiveSize();
        const borderWidth = 64;

        pos = {x: pos.x - size.width / 2, y: pos.y };

        let offsetPercent = (this.getPosition().x - document.field.getSize().width / 2) / (document.field.getSize().width / 2);


        // Draw top face
        ctx.fillStyle = averageHexColor(this.color, '#262626'); // Border color blended with background color
        ctx.beginPath();
        ctx.moveTo(pos.x - borderWidth * offsetPercent + this.padding, pos.y - borderWidth + this.padding); // A
        ctx.lineTo(pos.x + size.width - borderWidth * offsetPercent - 2 * this.padding, pos.y - borderWidth + this.padding); // B
        ctx.lineTo(pos.x + size.width - 2 * this.padding, pos.y + this.padding); // C
        ctx.lineTo(pos.x + this.padding, pos.y + this.padding); // D
        ctx.closePath();
        ctx.fill();


        ctx.beginPath();
        if (offsetPercent <= 0) {
            ctx.moveTo(pos.x + size.width - borderWidth * offsetPercent - 2 * this.padding, pos.y + size.height - borderWidth); // A
            ctx.lineTo(pos.x + size.width - borderWidth * offsetPercent - 2 * this.padding, pos.y - borderWidth + this.padding); // B
            ctx.lineTo(pos.x + size.width - 2 * this.padding, pos.y + this.padding); // C
            ctx.lineTo(pos.x + size.width - 2 * this.padding, pos.y + size.height); // D
        } else {
            ctx.moveTo(pos.x - borderWidth * offsetPercent + this.padding, pos.y - borderWidth + this.padding); // A
            ctx.lineTo(pos.x - borderWidth * offsetPercent + this.padding, pos.y + size.height - borderWidth); // B
            ctx.lineTo(pos.x + this.padding, pos.y + size.height); // C
            ctx.lineTo(pos.x + this.padding, pos.y + this.padding); // D
        }
        ctx.closePath();
        ctx.fill();

    }

    draw2D() {
        this.getContext().fillStyle = this.borderColor;
        this.getContext().fillRect(this.getAdaptivePosition().x + this.padding - this.getAdaptiveSize().width / 2 , this.getAdaptivePosition().y + this.padding, this.getAdaptiveSize().width - 2 * this.padding, this.getAdaptiveSize().height - 2 * this.padding);
        this.getContext().fillStyle = this.color;
        this.getContext().fillRect(this.getAdaptivePosition().x + this.padding + this.border - this.getAdaptiveSize().width / 2, this.getAdaptivePosition().y + this.padding + this.border, this.getAdaptiveSize().width - 2 * (this.padding + this.border), this.getAdaptiveSize().height - 2 * (this.padding + this.border));
    }

    tickEvent() {
        let xOffset = 0;
        const speed = document.field.getSize().width / 200;

        if (document.pressedKeys[37]) {
            xOffset -= speed;
        }

        if (document.pressedKeys[39]) {
            xOffset += speed;
        }

        this.position = {x: this.position.x + xOffset, y: this.position.y};

        if (this.position.x < this.size.width / 2) {
            this.position = {x: this.size.width / 2, y: this.position.y};
        }

        if (this.position.x > document.field.getSize().width - this.size.width / 2) {
            this.position = {x: document.field.getSize().width - this.size.width / 2, y: this.position.y};
        }
    }

    collide(item /* Ball Instance */) {
        const ballPos = item.getNextPosition();
        const ballSize = item.size;
        const ballDir = item.direction;
        const ballRad = (ballSize.width + ballSize.height) / 4; // Radius of the ball (assuming it's a circle)

        const platformPos = this.position;
        const platformSize = this.size;

        // Calculate the boundaries of the platform
        const platformLeft = platformPos.x - platformSize.width / 2;
        const platformRight = platformPos.x + platformSize.width / 2;
        const platformTop = platformPos.y;
        const platformBottom = platformPos.y + platformSize.height;

        // Check if the ball is within the horizontal range of the platform
        if (ballPos.x + ballRad >= platformLeft && ballPos.x - ballRad <= platformRight) {
            // Check if the ball's bottom is within the platform's top
            if (ballPos.y + ballRad >= platformTop && ballPos.y - ballRad <= platformBottom) {
                // Collision occurred, calculate the reflection vector
                // In this case, we'll just invert the y-direction of the ball
                return {x: ballDir.x, y: -ballDir.y};
            }
        }

        return null; // No collision
    }


}