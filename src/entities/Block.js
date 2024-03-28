import {Drawable} from "../interface/Drawable.js";
import {averageHexColor} from "../libs/ColorLib.js";
import {addCollider} from "../libs/StorageLibs.js";

const possibleColors = ["#ff4d4f", "#ff7a45", "#ffa940", "#ffc53d", "#ffec3d", "#bae637",
    "#73d13d", "#36cfc9", "#4096ff", "#597ef7", "#9254de", "#f759ab"];

export class Block extends Drawable {

    constructor(props = {}) {
        super(props);
        this.type = props.type;
        this.size = props.size;
        this.border = props.border ? props.border : 4;
        this.padding = props.padding ? props.padding : 4;
        this.color = this.type === "x" ? "#434343" : possibleColors[Math.round(Math.random() * (possibleColors.length - 1))];
        this.borderColor = averageHexColor('#8c8c8c', this.color);
        this.field = props.field;

        if (props.collidable && this.type !== "_") {
            addCollider(this);
        }
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
        const pos = this.getAdaptivePosition();
        const size = this.getAdaptiveSize();
        const borderWidth = 64;

        let offsetPercent = (this.getPosition().x - document.field.getSize().width / 2) / (document.field.getSize().width / 2);


        // Draw top face
        ctx.fillStyle = averageHexColor(this.color, '#262626'); // Border color blended with background color
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - borderWidth ); // A
        ctx.lineTo(pos.x + size.width, pos.y - borderWidth); // B
        ctx.lineTo(pos.x + size.width + borderWidth * offsetPercent, pos.y); // C
        ctx.lineTo(pos.x + borderWidth * offsetPercent, pos.y); // D
        ctx.closePath();
        ctx.fill();

        // Draw side face
        ctx.fillStyle = averageHexColor(this.color, '#434343'); // Border color blended with darker background color
        ctx.beginPath();
        if (offsetPercent <= 0) {
            // Рисуем справа от блока
            ctx.moveTo(pos.x + size.width, pos.y);
            ctx.lineTo(pos.x + size.width + borderWidth * offsetPercent, pos.y + borderWidth);
            ctx.lineTo(pos.x + size.width + borderWidth * offsetPercent, pos.y ); // C
            ctx.lineTo(pos.x + size.width, pos.y - borderWidth); // B
        } else {
            // Рисуем слева от блока
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(pos.x + borderWidth * offsetPercent, pos.y + borderWidth);
            ctx.lineTo(pos.x + borderWidth * offsetPercent, pos.y);
            ctx.lineTo(pos.x, pos.y - borderWidth);
        }
        ctx.closePath();
        ctx.fill();

    }

    draw2D() {
        this.getContext().fillStyle = this.borderColor;
        this.getContext().fillRect(this.getAdaptivePosition().x + this.padding, this.getAdaptivePosition().y + this.padding, this.getAdaptiveSize().width - 2 * this.padding, this.getAdaptiveSize().height - 2 * this.padding);
        this.getContext().fillStyle = this.color;
        this.getContext().fillRect(this.getAdaptivePosition().x + this.padding + this.border, this.getAdaptivePosition().y + this.padding + this.border, this.getAdaptiveSize().width - 2 * (this.padding + this.border), this.getAdaptiveSize().height - 2 * (this.padding + this.border));
    }

    collide(item /* Ball Instance */) {

        if (this.destroyed) {
            return null;
        }

        const ballPos = item.getNextPosition();
        const ballSize = item.size;
        const ballRad = (ballSize.width + ballSize.height) / 2; // Radius of the ball (assuming it's a circle)

        const blockPos = this.position;
        const blockSize = this.size;

        // Calculate the center of the block
        const blockCenterX = blockPos.x + blockSize.width / 2;
        const blockCenterY = blockPos.y + blockSize.height / 2;

        // Calculate the closest point on the block to the ball's center
        const closestX = Math.max(blockPos.x, Math.min(ballPos.x, blockPos.x + blockSize.width));
        const closestY = Math.max(blockPos.y, Math.min(ballPos.y, blockPos.y + blockSize.height));

        // Calculate the distance between the closest point and the ball's center
        const distanceX = ballPos.x - closestX;
        const distanceY = ballPos.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        // Check if the distance is less than the ball's radius squared
        if (distanceSquared <= ballRad * ballRad) {
            // Collision occurred
            // Determine the side of the block the ball hit
            const dx = ballPos.x - blockCenterX;
            const dy = ballPos.y - blockCenterY;
            const adx = Math.abs(dx);
            const ady = Math.abs(dy);

            if (this.type !== "x" && this.type !== "!") {
                this.destroyed = true;
            }

            if (adx > ady) {
                // Ball collided with either left or right side of the block
                return {x: item.direction.x, y: -item.direction.y}; // Reverse the x-direction
            } else {
                // Ball collided with either top or bottom side of the block
                return {x: -item.direction.x, y: item.direction.y}; // Reverse the y-direction
            }
        }

        return null; // No collision
    }
}