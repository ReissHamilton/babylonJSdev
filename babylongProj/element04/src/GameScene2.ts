//-----------------------------------------------------------
// TOP OF CODE - IMPORTING BABYLONS
import setSceneIndex from "./index";
import { SceneData } from "./interfaces";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Vector4,
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
    SpriteManager,
    Sprite,
    Nullable,
    InstancedMesh
  } from "@babylonjs/core";
  //---------------------------------------------------------

  //---------------------------------------------------------
  // MIDDLE OF CODE - FUNCTIONS
  
  // Create terrain
  function createTerrain(scene: Scene) {
   //Create large ground for valley environment
   const largeGroundMat = new StandardMaterial("largeGroundMat");
   largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png");
   
   const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
   largeGround.material = largeGroundMat;
    return largeGround;
  }

  // Create more detailed ground
  function createGround(scene: Scene) {
    //Create Village ground
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png");
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = MeshBuilder.CreateGround("ground", {width:24, height:24});
    ground.material = groundMat;
    ground.position.y = 0.1;
    return ground;
  }

  // Create Skybox
  function createSky(scene: Scene) {
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

  // Creating sprite trees
  function createTrees(scene: Scene) {
    const spriteManagerTrees = new SpriteManager("treesManager", "assets/textures/palmtree.png", 2000, {width: 512, height: 1024}, scene);

    //We create trees at random positions
    for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-30);
        tree.position.z = Math.random() * 20 + 8;
        tree.position.y = 0.5;
    }

    for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (25) + 7;
        tree.position.z = Math.random() * -35  + 8;
        tree.position.y = 0.5;
    }
    return spriteManagerTrees;
  }

  // Create house
  function createBox(scene: Scene) {
    // Texture
    const boxMat = new StandardMaterial("boxMat");
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png")

    //options parameter to set different images on each side
    const faceUV: Vector4[] = [];
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    // top 4 and bottom 5 not seen so not set

    const box = MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
    box.position.y = 0.5;
    box.material = boxMat;
    return box;
  }
  function createRoof(scene: Scene) {
    //texture
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg");

    const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
    roof.material = roofMat;
    return roof;
  }
  function createHouse(scene: Scene, style: number)  {
    //style 1 small style 2 semi detatched
    const boxMat = new StandardMaterial("boxMat");
    const faceUV: Vector4[] = []; // faces for small house
    if (style == 1) {
      boxMat.diffuseTexture = new Texture(
        "assets/textures/cubehouse.png"
      );
      faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
      faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
      faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
      // faceUV[4] would be for bottom but not used
      // faceUV[5] would be for top but not used
    } else {
      boxMat.diffuseTexture = new Texture(
        "assets/textures/semihouse.png"
      );
      faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
      faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
      faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
      // faceUV[4] would be for bottom but not used
      // faceUV[5] would be for top but not used
    }
  
    const box = MeshBuilder.CreateBox(
      "box",
      { width: style, height: 1, faceUV: faceUV, wrap: true },
      scene
    );
    box.position = new Vector3(0, 0.5, 0);
    box.scaling = new Vector3(1, 1, 1);
  
    box.material = boxMat;
  
    const roof = MeshBuilder.CreateCylinder("roof", {
      diameter: 1.3,
      height: 1.2,
      tessellation: 3,
    });
    roof.scaling.x = 0.75;
    roof.scaling.y = style * 0.85;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture(
      "assets/textures/roof.jpg",
      scene
    );
    roof.material = roofMat;
  
    const house = Mesh.MergeMeshes(
      [box, roof],
      true,
      false,
    undefined,
      false,
      true
    );
    // last true allows combined mesh to use multiple materials
  
    return house;
  }
  

  function createHouses(scene: Scene, style: number) {
    //Start by locating one each of the two house types then add others
  
    if (style == 1) {
      // show 1 small house
      createHouse(scene, 1);
    }
    if (style == 2) {
      // show 1 large house
      createHouse(scene, 2);
    }
    if (style == 3) {
      // show estate
      const houses: Nullable<Mesh>[] = [];
      const ihouses: InstancedMesh[] = [];    
      const places: number[][] = []; //each entry is an array [house type, rotation, x, z]
      places.push([1, 0, 0, 1]); // small house
      places.push([2, 0, 2, 1]); // semi  house
      places.push([1, 0, 0, -1]);
      places.push([2, 0, -2, -1]);
      places.push([2, Math.PI / 2, -2.5, 1]);
      places.push([2, -Math.PI / 2, +2.5, -1]);
      places.push([1, Math.PI / 2, -2.5, 3]);
      places.push([1, -Math.PI / 2, +2.5, -3]);
  
      houses[0] = createHouse(scene, 1);
      houses[1] = createHouse(scene, 2);
  
      for (let i = 0; i < places.length; i++) {
        if (places[i][0] === 1) {
          ihouses[i] = houses[0]!.createInstance("house" + i);
        } else {
          ihouses[i] = houses[1]!.createInstance("house" + i);
        }
        ihouses[i].rotation.y = places[i][1];
        ihouses[i].position.x = places[i][2];
        ihouses[i].position.z = places[i][3];
      }
    }
    // nothing returned by this function
  }

  
  function createHemisphericLight(scene: Scene) {
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
  
  export default function GameScene2(engine: Engine) {
    let scene   = new Scene(engine);
    let ground  = createGround(scene);
    let sky     = createSky(scene);
    let lightHemispheric = createHemisphericLight(scene);
    createHouses(scene, 3);
    createTrees(scene);
    createTerrain(scene);
    let camera  = createArcRotateCamera(scene);
  
  
    let that: SceneData = {
      scene,
      ground,
      sky,
      lightHemispheric,
      camera
    };
    return that;
  }
  