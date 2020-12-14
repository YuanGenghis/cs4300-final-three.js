let renderer, canvas, scene, camera, amlight, light


const SPHERE = "SPHERE"
const CUBE = "CUBE"

let objList = []

let objIndex = 0;

let ballTexture;
let boxTex;

const init = () => {

    canvas = document.getElementById('canvas')
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xCCE0FF);
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 200  );
    camera.position.set( 0, 10, 20);
    camera.lookAt(scene.position);
    scene.add( camera );

    document.getElementById("ctx").onchange = event => updateCameraPosition(event, "x")
    document.getElementById("cty").onchange = event => updateCameraPosition(event, "y")
    document.getElementById("ctz").onchange = event => updateCameraPosition(event, "z")
    document.getElementById("ami").onclick = event  => updateLight(event,"ami")
    document.getElementById("dir").onclick = event  => updateLight(event,"dir")


    // lights
    amlight = new THREE.AmbientLight( 0xfff2e6 );
    amlight.castShadow = true;

    scene.add(amlight);
    amlight.visible = !amlight.visible;

    light = new THREE.DirectionalLight( 0xdfebff, 1 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );

    light.castShadow = true;

    light.shadow.mapSize.width = 5000;
    light.shadow.mapSize.height = 5000;

    const d = 300;

    light.shadow.camera.left =  - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;

    light.shadow.camera.far = 1000;

    scene.add( light );

    renderer = new THREE.WebGLRenderer({canvas : canvas});
    renderer.setClearColor(0xfffffff, 1);
    renderer.setSize(canvas.width, canvas.height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;




    // const groundGeometry = new THREE.BoxBufferGeometry(20,0.4,10);
    const grassMaterial = new THREE.MeshLambertMaterial( { map:grassTexture} );

    let ground = new THREE.Mesh(new THREE.PlaneBufferGeometry( 20, 20 ), grassMaterial);
    ground.rotation.x = - Math.PI / 2;
    ground.position.set(0, 0, 0);
    ground.receiveShadow = true;
    scene.add(ground);


    const ballGeometry = new THREE.SphereGeometry( 0.4, 32, 32 );
    const ballMaterial = new THREE.MeshLambertMaterial( {map:footballTexture,
                                                            side: THREE.DoubleSide,
                                                            alphaTest: 0.5} );

    let ball = new THREE.Mesh( ballGeometry, ballMaterial );
    ball.position.set(0, 0.4, 0);
    ball.castShadow = true;
    ball.name = "ball1";
    objList.push("ball1");
    scene.add( ball );

    ball.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                                                depthPacking: THREE.RGBADepthPacking,
                                                                map: footballTexture,
                                                                alphaTest: 0.5
                                                            } );

    const boxGeometry = new THREE.BoxBufferGeometry(2,2,2);
    const boxMaterial = new THREE.MeshLambertMaterial( {map:yellowTexture,
                                                         side: THREE.DoubleSide,
                                                         alphaTest: 0.4} );
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(3, 1, 0);
    box.castShadow = true;
    objIndex++;
    ObjName = "cube" + objIndex;
    box.name = ObjName;
    objList.push(ObjName);
    scene.add(box);


    const animate = function () {
        requestAnimationFrame( animate );

        ball.rotation.x += 0.01;
        ball.rotation.y += 0.01;

        render();
    };
    animate();
}


const render = () => {
    const $list = $("#object-list")
    $list.empty()
    objList.forEach((obj) => {
        const $li = $(`
        <li>
        <label> 
        ${obj}
        <button onclick="deleteShape('${obj}')">
          Delete
        </button>
        </label>
        </li>
        `)
        $list.append($li);
    })
    renderer.render(scene, camera);
}


function deleteShape(name) {
    alert("here");
    removeObj(objList, name);
    const obj = scene.getObjectByName(name);
    scene.remove(obj);
}

function removeObj(arr, name) {
    const index = arr.indexOf(name);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

const updateCameraPosition = (event, axis) => {
    if (axis === "x") {
        camera.position.setX(event.target.value);
    }
    else if (axis === "y") {
        camera.position.setY(event.target.value);
    }
    else if (axis === "z") {
        camera.position.setZ(event.target.value);
    }
    camera.updateProjectionMatrix();

    render();
}

const addShape = () =>{
    ballTexture = document.getElementById("sel").value
    boxTex = document.getElementById("sel2").value
    const shapeType =document.querySelector("input[name='shape']:checked").value
    let px = document.getElementById('px').value
    let py = document.getElementById('py').value
    let pz = document.getElementById('pz').value
    if (shapeType === "CUBE") {
        const benchGeometry = new THREE.BoxBufferGeometry(2,2,2);
        // const benchMaterial = new THREE.MeshBasicMaterial({color:0x806f6e});
        let boxMaterial
        if (boxTex === "blue") {
            boxMaterial = new THREE.MeshLambertMaterial( {map:blueTexture,
                                                             side: THREE.DoubleSide,
                                                             alphaTest: 0.4} );
        } else {
            boxMaterial = new THREE.MeshLambertMaterial( {map:yellowTexture,
                                                             side: THREE.DoubleSide,
                                                             alphaTest: 0.4} );
        }
        const box = new THREE.Mesh(benchGeometry, boxMaterial);
        box.position.set(px,py,pz);
        box.castShadow = true;
        objIndex++;
        ObjName = "cube" + objIndex;
        box.name = ObjName;
        objList.push(ObjName);
        scene.add(box);
    } else if (shapeType === "SPHERE") {
        const addBallGeometry = new THREE.SphereGeometry( 0.4, 32, 32 );
        let newBallMaterial;
        if (ballTexture === "basketball") {
            newBallMaterial = new THREE.MeshLambertMaterial( {map:basketballTexture,
                                                                 side: THREE.DoubleSide,
                                                                 alphaTest: 0.4} );
        } else {
            newBallMaterial = new THREE.MeshLambertMaterial( {map:footballTexture,
                                                                       side: THREE.DoubleSide,
                                                                       alphaTest: 0.4} );
        }

        let newball = new THREE.Mesh( addBallGeometry, newBallMaterial );
        newball.position.set(px, py, pz);
        newball.castShadow = true;
        objIndex++;
        ObjName = "sphere" + objIndex;
        newball.name = ObjName;
        objList.push(ObjName);
        newball.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                                                       depthPacking: THREE.RGBADepthPacking,
                                                                       map: footballTexture,
                                                                       alphaTest: 0.5} );

        scene.add( newball );
    }
    render();
}

const updateLight = (event,type) => {
    if (type === "ami") {
        amlight.visible = !amlight.visible;
    }
    if (type === "dir") {
        light.visible = !light.visible;
    }
}
