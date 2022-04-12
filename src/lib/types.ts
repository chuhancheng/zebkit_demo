import { AmazingLine } from "./shapes/AmazingLine";
import { Shape } from "konva/lib/Shape";
import { Vector2d } from "konva/lib/types";

export enum Direction {
    TOP = 'top',
    RIGHT = 'right',
    LEFT = 'left',
    BOTTOM = 'bottom'
}

export interface RectConnectableVertex {
    top: Vector2d;
    left: Vector2d;
    right: Vector2d;
    bottom: Vector2d;
}

export interface IConnectorPoint {
    target: Shape;
    direction: Direction
}

// export interface IConnector {
//     from: IConnectorPoint;
//     to: IConnectorPoint;
//     line: AmazingLine;
// };

export interface ConnectorConfig {
    from: IConnectorPoint;
    to: IConnectorPoint
}

export class Connector {
    public from: IConnectorPoint;
    public to: IConnectorPoint;
    public line: AmazingLine;
    constructor(config: ConnectorConfig) {
        this.from = config.from;
        this.to = config.to;
        this.line = new AmazingLine({
            points: []
        });
    }
}