import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';

export default class StageManager {
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