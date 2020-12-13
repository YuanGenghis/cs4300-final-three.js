let renderer, canvas, scene, camera, amlight, light


const SPHERE = "SPHERE"
const CUBE = "CUBE"

let objList = []


const init = () => {

    canvas = document.getElementById('canvas')
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xCCE0FF);
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 200  );
    camera.position.set( 0, 3, 5);
    scene.add( camera );

    document.getElementById("ctx").onchange = event => updateCameraPosition(event, "x")
    document.getElementById("cty").onchange = event => updateCameraPosition(event, "y")
    document.getElementById("ctz").onchange = event => updateCameraPosition(event, "z")
    document.getElementById("ami").onclick = event  => updateLight(event,"ami")
    document.getElementById("dir").onclick = event  => updateLight(event,"dir")

    // lights
    amlight = new THREE.AmbientLight( 0xfff2e6 );
    scene.add(amlight);
    amlight.visible = !amlight.visible;

    light = new THREE.DirectionalLight( 0xdfebff, 1 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 300;

    light.shadow.camera.left = - d;
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
    objList.forEach((obj, index) => {
        const $li = $(`
        <li>
        <label>
        <h2>
        ${obj}
        </h2>
        <button onclick="deleteShape(${obj})">
          Delete
        </button>
        </li>
        `)
        $list.append($li);
    })
    renderer.render(scene, camera);
}

function deleteShape(name) {
    removeObj(objList, name);
    scene.remove(name);
}

function removeObj(arr, name) {
    return arr.filter(function(ele){
        return ele !== name;
    });
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
    const shapeType =document.querySelector("input[name='shape']:checked").value
    let px = document.getElementById('px').value
    let py = document.getElementById('py').value
    let pz = document.getElementById('pz').value
    if (shapeType === "CUBE") {
        const benchGeometry = new THREE.BoxBufferGeometry(2,2,2);
        const benchMaterial = new THREE.MeshBasicMaterial({color:0x806f6e});
        const bench = new THREE.Mesh(benchGeometry, benchMaterial);
        bench.position.set(px,py,pz);
        scene.add(bench);
    } else if (shapeType === "SPHERE") {
        const addBallGeometry = new THREE.SphereGeometry( 0.4, 32, 32 );
        const newBallMaterial = new THREE.MeshLambertMaterial( {map:footballTexture,
                                                                   side: THREE.DoubleSide,
                                                                   alphaTest: 0.4} );
        let newball = new THREE.Mesh( addBallGeometry, newBallMaterial );
        newball.position.set(px, py, pz);
        newball.castShadow = true;
        scene.add( newball );

        newball.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                                                       depthPacking: THREE.RGBADepthPacking,
                                                                       map: footballTexture,
                                                                       alphaTest: 0.5} );
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
