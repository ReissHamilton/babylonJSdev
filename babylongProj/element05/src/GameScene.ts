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
    PointLight,
    Camera,
    Engine,
    Texture,
    CubeTexture,
    Color3,
    SceneLoader,
    ShadowGenerator,
    ActionManager,
    Space,
    ExecuteCodeAction,
    AnimationPropertiesOverride,
    Sound,
  } from "@babylonjs/core";
  import * as GUI from "@babylonjs/gui";
  import HavokPhysics from "@babylonjs/havok";
  import { HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
  import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
  import { FireProceduralTexture } from '@babylonjs/procedural-textures/fire/fireProceduralTexture';
  import { MarbleProceduralTexture} from '@babylonjs/procedural-textures/marble/marbleProceduralTexture';
  //---------------------------------------------------------
 
  //---------------------------------------------------------
  // Initialisation of physics (Havok)
  let initializedHavok;

  HavokPhysics().then((havok) => {
  initializedHavok = havok;
  });

  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);
  
  globalThis.HK = await HavokPhysics();

  //---------------------------------------------------------

  // MIDDLE OF CODE - FUNCTIONS
  let keyDownMap: any[] = [];


  function importPlayerMesh(scene: Scene, collider: Mesh, x: number, y: number) {
    let tempItem = { flag: false } 
    let item: any = SceneLoader.ImportMesh("", "./models/", "dummy3.babylon", scene, function(newMeshes, particleSystems, skeletons) {
    let mesh = newMeshes[0];
    let skeleton = skeletons[0];
    skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
    skeleton.animationPropertiesOverride.enableBlending = true; 
    skeleton.animationPropertiesOverride.blendingSpeed = 0.05; 
    skeleton.animationPropertiesOverride.loopMode = 1;

    let walkRange: any = skeleton.getAnimationRange("YBot_Walk");
    let runRange: any = skeleton.getAnimationRange("YBot_Run");
    let leftRange: any = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
    let rightRange: any = skeleton.getAnimationRange("YBot_RightStrafe");
    let idleRange: any = skeleton.getAnimationRange("YBot_Idle");

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

       // Collision
       if (mesh.intersectsMesh(collider)) {
        console.log("COLLIDED");
      }
      });
     
      // Physics Collision
      item = mesh;
      let playerAggregate = new PhysicsAggregate(item, PhysicsShapeType.CAPSULE, { mass: 0 }, scene);
      playerAggregate.body.disablePreStep = false;

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

  function createPointLight(scene: Scene, px: number, py: number, pz: number, colX: number, colY: number, colZ: number, mesh: Mesh)
  {
    const pointLight = new PointLight("pointLight", new Vector3(px, py, pz), scene);
        pointLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
        let shadowGenerator = new ShadowGenerator(1024, pointLight)
        shadowGenerator = new ShadowGenerator(1024, pointLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return pointLight;
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

  function createBox(scene: Scene, x: number, y: number, z: number, rotateNumber: number){
    var marbleMaterial = new StandardMaterial("torus", scene);
    var marbleTexture = new MarbleProceduralTexture("marble", 512, scene);
    marbleTexture.numberOfTilesHeight = 3;
    marbleTexture.numberOfTilesWidth = 3;
    marbleMaterial.ambientTexture = marbleTexture;

    rotateNumber;
    let box: Mesh = MeshBuilder.CreateBox("box", {height: 10, width: 50});
    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    box.rotation.y = rotateNumber;
    box.material = marbleMaterial;

    return box;
  }

  function createSpinningBox(scene: Scene, x: number, y: number, z: number, rotateNumber: number){
    var marbleMaterial = new StandardMaterial("torus", scene);
    var marbleTexture = new MarbleProceduralTexture("marble", 512, scene);
    marbleTexture.numberOfTilesHeight = 3;
    marbleTexture.numberOfTilesWidth = 3;
    marbleMaterial.ambientTexture = marbleTexture;

    rotateNumber;
    let box: Mesh = MeshBuilder.CreateBox("box", {height: 5, width: 5, depth: 5});
    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    box.rotation.y = rotateNumber;
    box.material = marbleMaterial;

    scene.registerAfterRender(function () {
      box.rotate(new Vector3(4, 8, 2)/*axis*/, 0.02/*angle*/, Space.LOCAL);
    })
    return box;
  }

  function createFloor(scene: Scene, x: number, y: number, z: number, rotateNumber: number){
    var marbleMaterial = new StandardMaterial("torus", scene);
    var marbleTexture = new MarbleProceduralTexture("marble", 512, scene);
    marbleTexture.numberOfTilesHeight = 3;
    marbleTexture.numberOfTilesWidth = 3;
    marbleMaterial.ambientTexture = marbleTexture;

    rotateNumber;
    let box: Mesh = MeshBuilder.CreateBox("box", {height: 1, width: 10, depth: 5});
    box.material = marbleMaterial;
    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    box.rotation.y = rotateNumber;
    return box;
  }
    
  function createGround(scene: Scene) {
    var fireMaterial = new StandardMaterial("fontainSculptur2", scene);
    var fireTexture = new FireProceduralTexture("fire", 256, scene);
    fireMaterial.diffuseTexture = fireTexture;
    fireMaterial.opacityTexture = fireTexture;

    const ground: Mesh = MeshBuilder.CreateGround("ground", {height: 50, width: 50, subdivisions: 16});
    const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
    ground.material = fireMaterial;
  
    return ground;
  }
  //-------------------------------------------------------

  //-------------------------------------------------------
  // BOTTOM OF CODE - MAIN RENDERING
  
  export default function GameScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      skybox?: Mesh;
      box?: Mesh;
      spinningbox?: Mesh;
      floor?: Mesh;
      faceBox?: Mesh;
      light?: Light;
      sphere?: Mesh;
      torus?: Mesh;
      polyhedra?: Mesh;
      ground?: Mesh;
      importMesh?: any;
      actionManager?: any;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
    // Initialise Physics
    that.scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);
    //-------------------------------------------------------

    // Spawn Assets
    that.skybox = createSkybox(that.scene);
    that.light = createLight(that.scene);

    // Create walls
    that.box = createBox(that.scene, 0, 5, 25, 0);
    that.box = createBox(that.scene, 0, 5, -25, 0);
    that.box = createBox(that.scene, 25, 5, 0, 300);
    that.box = createBox(that.scene, -25, 5, 0, 300);

    // Create Spinning
    that.spinningbox = createSpinningBox(that.scene, 15, 10, 0, 0)
    that.light = createPointLight(that.scene,  2, 2, 2, 0.75, 0.5, 0.91, that.box);

    that.spinningbox = createSpinningBox(that.scene, -15, 10, 0, 0)
    that.light = createPointLight(that.scene,  4, 4, 4, 0.75, 0.5, 0.91, that.box);

    that.spinningbox = createSpinningBox(that.scene, 0, 10, 15, 0)
    that.light = createPointLight(that.scene,  -2, -2, -2, 0.75, 0.5, 0.91, that.box);

    that.spinningbox = createSpinningBox(that.scene, 0, 10, -15, 0)
    that.light = createPointLight(that.scene,  -4, -4, -4, 0.75, 0.5, 0.91, that.box);

    // Create floor
    that.floor = createFloor(that.scene, 10, 0.5, 0, 0)
    that.floor = createFloor(that.scene, -10, 0.5, 0, 0)
    that.floor = createFloor(that.scene, 0, 0.5, 10, 300)
    that.floor = createFloor(that.scene, 0, 0.5, -10, 300)
    that.floor = createFloor(that.scene, 10, 0.5, -10, 90)
    that.floor = createFloor(that.scene, -10, 0.5, 10, 90)

    that.ground = createGround(that.scene);
    that.importMesh = importPlayerMesh(that.scene, that.box, 0 , 0);
    that.actionManager = actionManager(that.scene);
    that.camera = createArcRotateCamera(that.scene);

    // that.house = createHouse(that.scene)
    return that;
  }