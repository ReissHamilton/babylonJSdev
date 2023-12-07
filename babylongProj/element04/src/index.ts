import { Engine, ISceneComponent, ISceneLoaderAsyncResult, ISceneLoaderPlugin, 
    ISceneLoaderPluginAsync, SceneLoader, Vector3} from "@babylonjs/core";
import MenuScene from "./MenuScene";
import GameScene from "./GameScene";
import GameScene2 from "./GameScene2";
import GameScene3 from "./GameScene3";
import './main.css';

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let scene;
let scenes: any[] = [];

let eng = new Engine(canvas, true, undefined, true);

scenes[0] = MenuScene(eng);
scenes[1] = GameScene(eng);
scenes[2] = GameScene2(eng);
scenes[3] = GameScene3(eng);
scene = scenes[0].scene;

setSceneIndex(0);

export default function setSceneIndex(i: number) {
    eng.runRenderLoop(() => {
        scenes[i].scene.render();
    });  
}              