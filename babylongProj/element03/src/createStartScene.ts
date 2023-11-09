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
  } from "@babylonjs/core";
  //---------------------------------------------------------

  //---------------------------------------------------------
  // MIDDLE OF CODE - FUNCTIONS

  let keyDownMap: any[] = [];


  function importPlayerMesh(scene, x: number, y: number) {
    let item = SceneLoader.ImportMesh("", "./models/", "dummy3.babylon", scene, function(newMeshes) {
    let mesh = newMeshes[0];
    scene.onBeforeRenderObservable.add(()=> { 
      if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
      mesh.position.z += 0.1; 
      mesh.rotation.y = 0; 
      } 
      if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
      mesh.position.x -= 0.1; 
      mesh.rotation.y = 3 * Math.PI / 2; 
      } 
      if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
      mesh.position.z -= 0.1; 
      mesh.rotation.y = 2 * Math.PI / 2; 
      } 
      if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
      mesh.position.x += 0.1; 
      mesh.rotation.y = Math.PI / 2; 
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