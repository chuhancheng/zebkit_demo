import Konva from 'konva';
import { Shape } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import StageManager from './lib/util';
import { Vector2d } from 'konva/lib/types';

interface RectConnectablePoints {
    top: Vector2d,
    left: Vector2d,
    right: Vector2d,
    bottom: Vector2d
}

function getShapeConnectablePoint(obj: Shape): RectConnectablePoints {
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

function getConnectorLinePath(obj1: Shape, obj2: Shape): number[] {
    const obj1ContectablePoint = getShapeConnectablePoint(obj1);
    const obj2ContectablePoint = getShapeConnectablePoint(obj2);
    console.log('obj1ContectablePoint:', obj1ContectablePoint);
    console.log('obj2ContectablePoint:', obj2ContectablePoint);

    return [];
}

function generateContent(stage: Stage): void {
    const layer = new Konva.Layer();

    const line = new Konva.Line({
        // points: [70, 70, 140, 23, 250, 60, 300, 20],
        points: [10, 10, 30, 30, 30, 70, 70, 70],
        // tension: 0,
        // visible: false,
        // bezier: true,
        stroke: 'red',
        strokeWidth: 4,
        // lineCap: 'round',
        // lineJoin: 'round',
    })

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
        y: 30,
        width: 50,
        height: 50,
        fill: 'black',
        draggable: true
    });

    // rect1.on('dragstart', function () {
    //     console.log('dragstart');
    // });
    rect1.on('dragmove', function () {
        // line.visible(true);
        const path = getConnectorLinePath(rect1, rect2);
        line.points(path);
        console.log('dragmove');
    });
    // rect1.on('dragend', function () {
    //     console.log('dragend');
    // });
    layer.add(rect1);
    layer.add(rect2);
    layer.add(line);
    stage.add(layer);
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
    const stage = StageManager.createStage(window.innerWidth - 20, window.innerHeight - 20);
    generateBackground(stage);
    generateContent(stage);
}

bootstrap();

