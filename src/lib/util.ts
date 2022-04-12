import { Connector, Direction, RectConnectableVertex } from './types';

import Konva from 'konva';
import { Shape } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

// 線段是否與矩形重疊
export function hasIntersection(container: {
    x: number;
    y: number;
    width: number;
    height: number;
}, line: [Vector2d, Vector2d]): boolean {
    let left = container.x;
    let right = container.x + container.width;
    let top = container.y;
    let bottom = container.y + container.height;

    return (right >= line[1].x &&
            left <= line[0].x &&
            top <= line[1].y &&
            bottom >= line[0].y) ||
            (right >= line[0].x &&
            left <= line[1].x &&
            top <= line[0].y &&
            bottom >= line[1].y) ||
            (left <= line[0].x &&
            right >= line[1].x &&
            top <= line[0].y &&
            bottom >= line[1].y) ||
            (left <= line[1].x &&
            right >= line[0].x &&
            top <= line[1].y &&
            bottom >= line[0].y);
}

export function getConnectorLinePath(connector: Connector): number[] {
    const padding = 20;
    const startPoint: Vector2d = getShapeConnectableVertex(connector.from.target)[connector.from.direction];
    let startVertex: Vector2d = {...startPoint};
    const endPoint: Vector2d = getShapeConnectableVertex(connector.to.target)[connector.to.direction];
    let endVertex: Vector2d = {...endPoint};
    switch(connector.from.direction) {
        case Direction.TOP:
            startVertex.y -= padding;
            break;
        case Direction.BOTTOM:
            startVertex.y += padding;
            break;
        case Direction.LEFT:
            startVertex.x -= padding;
            break;
        case Direction.RIGHT:
            startVertex.x += padding;
            break;
        default:
            throw new Error(`Undefined Direction: ${connector.from.direction}`);
    }
    switch(connector.to.direction) {
        case Direction.TOP:
            endVertex.y -= padding;
            break;
        case Direction.BOTTOM:
            endVertex.y += padding;
            break;
        case Direction.LEFT:
            endVertex.x -= padding;
            break;
        case Direction.RIGHT:
            endVertex.x += padding;
            break;
        default:
            throw new Error(`Undefined Direction: ${connector.from.direction}`);
    }
    
    return [
        ...Object.values(startPoint),
        ...Object.values(startVertex),
        ...Object.values(endVertex),
        ...Object.values(endPoint)
    ];
}

export function getShapeConnectableVertex(obj: Shape): RectConnectableVertex {
    const top = {
        x: obj.getClientRect().x + obj.getClientRect().width / 2,
        y: obj.getClientRect().y
    }
    const left = {
        x: obj.getClientRect().x,
        y: obj.getClientRect().y + obj.getClientRect().height / 2,
    }
    const right = {
        x: obj.getClientRect().x + obj.getClientRect().width,
        y: obj.getClientRect().y + obj.getClientRect().height / 2,
    }
    const bottom = {
        x: obj.getClientRect().x + obj.getClientRect().width / 2,
        y: obj.getClientRect().y + obj.getClientRect().height,
    }
    return {
        top,
        left,
        right,
        bottom
    };
}
export class StageManager {
    private static stageIndex = 1;
    constructor(){}

    public static createStage(width: number, height: number): Stage {
        const container = document.createElement('div');
        const containerID = `container-${this.stageIndex}`;
        container.id = containerID;
        document.body.appendChild(container);
        this.stageIndex++;
        const stage = new Konva.Stage({
            container: containerID,
            width,
            height
        });
        return stage;
    }
}