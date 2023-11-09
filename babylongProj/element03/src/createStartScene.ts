//-----------------------------------------------------------
// TOP OF CODE - IMPORTING BABYLONS
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
    AnimationPropertiesOverride
  } from "@babylonjs/core";
  //---------------------------------------------------------

  //---------------------------------------------------------
  // MIDDLE OF CODE - FUNCTIONS

  let keyDownMap: any[] = [];


  function importPlayerMesh(scene, x: number, y: number) {
    let tempItem = { flag: false } 
    let item = SceneLoader.ImportMesh("", "./models/", "dummy3.babylon", scene, function(newMeshes, particleSystems, skeletons) {
    let mesh = newMeshes[0];
    let skeleton = skeletons[0];
    skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
    skeleton.animationPropertiesOverride.enableBlending = true; 
    skeleton.animationPropertiesOverride.blendingSpeed = 0.05; 
    skeleton.animationPropertiesOverride.loopMode = 1;

    let walkRange: any = skeleton.getAnimationRange("YBot_Walk");
    // let runRange: any = skeleton.getAnimationRange("YBot_Run");
    // let leftRange: any = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
    // let rightRange: any = skeleton.getAnimationRange("YBot_RightStrafe");
    // let idleRange: any = skeleton.getAnimationRange("YBot_Idle");

    let animating: boolean = false; 

    scene.onBeforeRenderObservable.add(()=> { 
      let keyDown: boolean = false;
      if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
      mesh.position.z += 0.1; 
      mesh.rotation.y = 0; 
      keyDown = true;
      } 
      if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
      mesh.position.x -= 0.1; 
      mesh.rotation.y = 3 * Math.PI / 2;
      keyDown = true; 
      } 
      if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
      mesh.position.z -= 0.1; 
      mesh.rotation.y = 2 * Math.PI / 2;
      keyDown = true; 
      } 
      if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
      mesh.position.x += 0.1; 
      mesh.rotation.y = Math.PI / 2;
      keyDown = true; 
      }
      
      if (keyDown) {
        if (!animating) {
        animating = true; 
        scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
        } 
       } else { 
        animating = false; 
        scene.stopAnimation(skeleton);
       }
      });
     
    });
    return item
  }

    function actionManager(scene: Scene){
      scene.actionManager = new ActionManager(scene);

      scene.actionManager.registerAction( 
      new ExecuteCodeAction( 
      { 
      trigger: ActionManager.OnKeyDownTrigger, 
      //parameters: 'w' 
      },
      function(evt) {keyDownMap[evt.sourceEvent.key] = true; }
      ) 
      );
      scene.actionManager.registerAction( 
      new ExecuteCodeAction( 
      { 
      trigger: ActionManager.OnKeyUpTrigger
      },
      function(evt) {keyDownMap[evt.sourceEvent.key] = false; }
      ) 
      );
      return scene.actionManager;
    }

  // Create more detailed ground
  function createGround(scene: Scene) {
    const ground = MeshBuilder.CreateGround("ground", {height: 10, width: 10, subdivisions: 4});
    return ground;
  }

  // Create Skybox
  function createSkybox(scene: Scene) {
    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
	  const skyboxMaterial = new StandardMaterial("skyBox", scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
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
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      skybox?: Mesh;
      light?: Light;
      sphere?: Mesh;
      ground?: Mesh;
      importMesh?: any;
      actionManager?: any;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
  
    // Spawn Assets
    that.skybox = createSkybox(that.scene);
    that.light = createLight(that.scene);
    that.ground = createGround(that.scene);
    that.importMesh = importPlayerMesh(that.scene, 0 , 0);
    that.actionManager = actionManager(that.scene);
    that.camera = createArcRotateCamera(that.scene);

    // that.house = createHouse(that.scene)
    return that;
  }