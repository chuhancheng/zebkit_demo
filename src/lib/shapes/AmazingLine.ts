import { Shape, ShapeConfig } from "konva/lib/Shape";

import { Context } from "konva/lib/Context";

const RADIUS = 10;

export class AmazingLine<Config extends ShapeConfig = ShapeConfig> extends Shape {
    private defaultConfig: ShapeConfig = {
        lineColor: '#00D2AA',
        circleColor: 'yellow',
        width: 4
    }
    constructor(config?: Config) {
        super(config);
        if (!config.stroke) {
            this.stroke(this.defaultConfig.lineColor);
        }
        if (!config.lineCap) {
            this.lineCap('round');
        }
        if (!config.lineJoin) {
            this.lineJoin('round');
        }
        if (!config.strokeWidth) {
            this.strokeWidth(this.defaultConfig.width);
        }
        this.sceneFunc(this.customSceneFunc);
    }

    private customSceneFunc(context: Context, shape: Shape): void {
        this.optimizePath();
        const points: number[] = shape.attrs.points;
        context.beginPath();
        const connectPoints = (fromX: number, fromY: number, toX: number, toY: number) => {
            context.moveTo(fromX, fromY);
            context.lineTo(toX, toY);
            // const width = toX - fromX;
            // const height = toY - fromY;
            // const direction = Math.sign(height);
            // const radius = Math.min(
            //     RADIUS,
            //     Math.abs(height / 2),
            //     Math.abs(width / 2)
            // );
            // context.moveTo(fromX, fromY);
            // context.lineTo(fromX + width / 2 - RADIUS, fromY);
            // context.quadraticCurveTo(
            //     fromX + width / 2,
            //     fromY,
            //     fromX + width / 2,
            //     fromY + direction * radius
            // );
            // context.lineTo(fromX + width / 2, toY - direction * radius);
            // context.quadraticCurveTo(
            //     fromX + width / 2,
            //     toY,
            //     fromX + width / 2 + radius,
            //     toY
            // );
            // context.lineTo(toX, toY);
        }
        let fromX = points[0];
        let fromY = points[1];
        let toX = points[0];
        let toY = points[1];
        const connectorNumber = Math.floor(points.length/2);
        for(let i=1;i<connectorNumber;i++) {
            toX = points[i*2];
            toY = points[i*2+1];
            connectPoints(fromX, fromY, toX, toY);
            fromX = toX;
            fromY = toY;
        }
        shape.stroke(this.defaultConfig.lineColor);
        shape.strokeWidth(this.defaultConfig.width);
        context.fillStrokeShape(shape);

        context.beginPath();
        shape.stroke(this.defaultConfig.circleColor);
        shape.strokeWidth(this.defaultConfig.width * 2);
        context.moveTo(points[0], points[1]);
        context.arc(points[0], points[1], 2, 0, 2 * Math.PI, false);
        context.moveTo(fromX, fromY);
        context.arc(fromX, fromY, 2, 0, 2 * Math.PI, false);
        context.fillStrokeShape(shape);
    }

    /**
     * 1. 消除不需要的點路徑
     * 2. 把斜線路徑變成垂直路徑
     * @returns void
     */
    public optimizePath(): void {
        const pathPoints = [...this.attrs.points];
        let [fromX, fromY] = pathPoints.splice(0, 2);
        if (!fromX || !fromY) return;
    
        let toX: number, toY: number;
        const path: number[] = [];
        path.push(fromX, fromY);
        while(true) {
            [toX, toY] = pathPoints.splice(0, 2);
            if (!toX || !toY) break;
            // 消除重複的點路徑
            if (fromX === toX && fromY === toY) {
                continue;
            }
            // 把斜線變成兩條垂直線
            if (fromX !== toX && fromY !== toY) {
                let diffY = toY - fromY;
                path.push(fromX, fromY + diffY);
            }
            // TODO: 合併在同一直線上的點。把在 path 裡的點都 pop 出來，直到發現不在同一直線為止。
            // if (fromX === toX || fromY === toY) {
            //     continue;
            // }
            path.push(toX, toY);
            [fromX, fromY] = [toX, toY];
        }
        this.attrs.points = path;
    }
}