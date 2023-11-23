//-----------------------------------------------------------
// TOP OF CODE - IMPORTING BABYLONS
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
    Sprite
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

  // Creating sprite trees
  function createTrees(scene: Scene) {
    const spriteManagerTrees = new SpriteManager("treesManager", "textures/palmtree.png", 2000, {width: 512, height: 1024}, scene);

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
  function createHouse(scene: Scene) {
    const box = createBox(scene);
    const roof = createRoof(scene);
    const house: any = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);

  //   const places = []; //each entry is an array [house type, rotation, x, z]
  //   places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
  //   places.push([2, -Math.PI / 16, -4.5, 3 ]);
  //   places.push([2, -Math.PI / 16, -1.5, 4 ]);
  //   places.push([2, -Math.PI / 3, 1.5, 6 ]);
  //   places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
  //   places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
  //   places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
  //   places.push([1, 5 * Math.PI / 4, 0, -1 ]);
  //   places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
  //   places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
  //   places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
  //   places.push([2, Math.PI / 1.9, 4.75, -1 ]);
  //   places.push([1, Math.PI / 1.95, 4.5, -3 ]);
  //   places.push([2, Math.PI / 1.9, 4.75, -5 ]);
  //   places.push([1, Math.PI / 1.9, 4.75, -7 ]);
  //   places.push([2, -Math.PI / 3, 5.25, 2 ]);
  //   places.push([1, -Math.PI / 3, 6, 4 ]);

  //   for (let i = 0; i < places.length; i++) {
  //     if (places[i][0] === 1) {
  //         house[i].createInstance("house" + i);
  //     }
  //     house[i].rotation.y = places[i][1];
  //     house[i].position.x = places[i][2];
  //     house[i].position.z = places[i][3];
  // }
    return house;
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
      terrain?: Mesh;
      skybox?: Mesh;
      box?: Mesh;
      roof?: Mesh;
      house?: Mesh;
      trees?: SpriteManager;
      light?: Light;
      sphere?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
  
    // Spawn Assets
    that.terrain = createTerrain(that.scene);
    that.skybox = createSkybox(that.scene);
    that.trees = createTrees(that.scene);
    that.light = createLight(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);

    // Houses
    /*that.box = createBox(that.scene);
    that.roof = createRoof(that.scene);*/
    that.house = createHouse(that.scene)
    return that;
  }