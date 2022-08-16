import { Connector, Direction } from './lib/types';
import {StageManager, getConnectorLinePath, hasIntersection} from './lib/util';

import { AmazingLine } from './lib/shapes/AmazingLine';
import { Container } from 'konva/lib/Container';
import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Node } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

const stage = StageManager.createStage(window.innerWidth - 20, window.innerHeight - 20);
const connectors: Connector[] = [];


function generateContent(stage: Stage): void {
    const layer = new Konva.Layer();
    const lineGroup = new Konva.Group();

    const rect1 = new Konva.Rect({
        x: 30,
        y: 30,
        width: 50,
        height: 50,
        fill: 'green',
        draggable: true
    });
    const rect2 = new Konva.Rect({
        x: 230,
        y: 230,
        width: 50,
        height: 50,
        fill: 'black',
        draggable: true
    });

    const rect3 = new Konva.Rect({
        x: 180,
        y: 130,
        width: 50,
        height: 50,
        fill: 'red',
        draggable: true
    });

    connectors.push(new Connector({
        from: { target: rect1, direction: Direction.TOP },
        to: { target: rect2, direction: Direction.TOP }
    }))
    connectors.push(new Connector({
        from: { target: rect1, direction: Direction.TOP },
        to: { target: rect3, direction: Direction.TOP }
    }))
    connectors.push(new Connector({
        from: { target: rect2, direction: Direction.TOP },
        to: { target: rect3, direction: Direction.BOTTOM }
    }))

    connectors.forEach(item => {
        lineGroup.add(item.line);
    });

    layer.on('dragmove', function (e) {
        updateConnector(layer);
    });
    layer.add(rect1);
    layer.add(rect2);
    layer.add(rect3);
    layer.add(lineGroup);
    stage.add(layer);
    updateConnector(layer);
}

function getNoOverlapWithNodesPath(source: number[], nodes: Node[]): number[]{
    const points: number[] = [...source];
    const from: Vector2d = {
        x: null,
        y: null
    }
    const to: Vector2d = {
        x: null,
        y: null
    }
    const next: Vector2d = {
        x: null,
        y: null
    }
    for(let i=1;i<Math.floor(points.length/2)-2;i++) {
        [from.x, from.y] = points.slice(i*2, i*2+2);
        [to.x, to.y] = points.slice((i+1)*2, (i+1)*2+2);
        [next.x, next.y] = points.slice((i+2)*2, (i+2)*2+2);
        for(let j=0;j<nodes.length;j++) {
            const target = nodes[j];
            if (hasIntersection(target.getClientRect(), [from, to])) {
                // 表示是垂直線
                if (from.x === to.x) {
                    // 線段的下一個點的方向來決定要推移線段的方向
                    if (next.x && next.x < from.x) {
                        from.x = target.getClientRect().x - 20;
                        to.x = target.getClientRect().x - 20;
                    } else {
                        from.x = target.getClientRect().x + target.getClientRect().width + 20;
                        to.x = target.getClientRect().x+ target.getClientRect().width + 20;
                    }
                    points[i*2] = from.x;
                    points[(i+1)*2] = from.x;
                }
                // 表示是水平線
                if (from.y === to.y) {
                    // 線段的下一個點的方向來決定要推移線段的方向
                    if (next.y && next.y < from.y) {
                        from.y = target.getClientRect().y - 20;
                        to.y = target.getClientRect().y - 20;
                    } else {
                        from.y = target.getClientRect().y + target.getClientRect().height + 20;
                        to.y = target.getClientRect().y + target.getClientRect().height + 20;
                    }
                    points[i*2+1] = from.y;
                    points[(i+1)*2+1] = from.y;
                }
            }
        }
    }
    return points;
}

function updateConnector(layer: Layer): void {
    const nodes: Node[] = layer.find('Rect');
    connectors.forEach(item => {
        // 初始化成四個點的線(頭, 連結點, 連結點, 尾)
        const points = getConnectorLinePath(item);
        item.line.attrs.points = points;
        item.line.optimizePath();
        const noOverlapPath = getNoOverlapWithNodesPath(item.line.attrs.points, nodes);
        item.line.attrs.points = noOverlapPath;
    });
}

function generateBackground(stage: Stage): void {
    const layer = new Konva.Layer();

    const backRect = new Konva.Rect({
        x: stage.x(),
        y: stage.y(),
        width: stage.width(),
        height: stage.height(),
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 4,
    });
    layer.add(backRect);
    stage.add(layer);
}

function bootstrap() {
    generateBackground(stage);
    generateContent(stage);
}

bootstrap();

