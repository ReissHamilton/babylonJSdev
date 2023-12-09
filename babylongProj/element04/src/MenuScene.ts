//-----------------------------------------------------------
// TOP OF CODE - IMPORTING BABYLONS
import setSceneIndex from "./index";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Engine,
    Texture,
    StandardMaterial,
    CubeTexture,
    Color3,
    SceneLoader,
    ActionManager,
    ExecuteCodeAction,
    AnimationPropertiesOverride,
    Sound,
  } from "@babylonjs/core";
  import * as GUI from "@babylonjs/gui";
  import { HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
  //---------------------------------------------------------
  
  function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {
    let button = GUI.Button.CreateSimpleButton(name, index);
        button.left = x;
        button.top = y;
        button.width = "160px";
        button.height = "60px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "blue";

        const buttonClick = new Sound("MenuClickSFX", "./public/Audio/menu-click.wav", scene, null, {
          loop: false,
          autoplay: false,
        });

        button.onPointerUpObservable.add(function() {
          buttonClick.play();
          setSceneIndex(1);
        });
        advtex.addControl(button);
        return button;
    }

    function createSceneButton2(scene: Scene, name: string, index: string, x: string, y: string, advtex) {
      let button = GUI.Button.CreateSimpleButton(name, index);
          button.left = x;
          button.top = y;
          button.width = "160px";
          button.height = "60px";
          button.color = "white";
          button.cornerRadius = 20;
          button.background = "Purple";
  
          const buttonClick = new Sound("MenuClickSFX", "./assets/Audio/menu-click.wav", scene, null, {
            loop: false,
            autoplay: false,
          });
  
          button.onPointerUpObservable.add(function() {
            buttonClick.play();
            setSceneIndex(2);
          });
          advtex.addControl(button);
          return button;
      }

      function createSceneButton3(scene: Scene, name: string, index: string, x: string, y: string, advtex) {
        let button = GUI.Button.CreateSimpleButton(name, index);
            button.left = x;
            button.top = y;
            button.width = "160px";
            button.height = "60px";
            button.color = "white";
            button.cornerRadius = 20;
            button.background = "Green";
    
            const buttonClick = new Sound("MenuClickSFX", "./assets/Audio/menu-click.wav", scene, null, {
              loop: false,
              autoplay: false,
            });
    
            button.onPointerUpObservable.add(function() {
              buttonClick.play();
              setSceneIndex(3);
            });
            advtex.addControl(button);
            return button;
        }
 
  //---------------------------------------------------------
  //---------------------------------------------------------

  // // MIDDLE OF CODE - FUNCTIONS

  // Create Skybox
  function createSkybox(scene: Scene) {
    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
	  const skyboxMaterial = new StandardMaterial("skyBox", scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new CubeTexture("assets/textures/skybox", scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new Color3(0, 0, 0);
	  skybox.material = skyboxMaterial;
    return skybox;
  }

  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 10,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
  //-------------------------------------------------------
  //-------------------------------------------------------
  // BOTTOM OF CODE - MAIN RENDERING
  
  export default function MenuScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      skybox?: Mesh;
      //box?: Mesh;
      light?: Light;
      sphere?: Mesh;
      //ground?: Mesh;
      //importMesh?: any;
      //actionManager?: any;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
    // Initialise Physics
    //that.scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);
    //-------------------------------------------------------

    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
    let button2 = createSceneButton2(that.scene, "but1", "Load Element 2", "0px", "-75px", advancedTexture);
    let button3 = createSceneButton3(that.scene, "but1", "Load Element 1", "0px", "0px", advancedTexture);

    // Spawn Assets
    that.skybox = createSkybox(that.scene);
    that.light = createLight(that.scene);
    //that.box = createBox(that.scene, 2, 2, 2);
    //that.ground = createGround(that.scene);
    //that.importMesh = importPlayerMesh(that.scene, that.box, 0 , 0);
    //that.actionManager = actionManager(that.scene);
    that.camera = createArcRotateCamera(that.scene);

    // that.house = createHouse(that.scene)
    return that;
  }