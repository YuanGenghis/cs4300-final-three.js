let renderer, canvas, scene, camera, amlight, light



const SPHERE = "SPHERE"
const CUBE = "CUBE"


const OBJLoader2Example = function ( elementToBindTo ) {
    this.aspectRatio = 1;
    this.controls = null;
};

OBJLoader2Example.prototype = {

    constructor: OBJLoader2Example,

    initGL: function () {
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        const helper = new THREE.GridHelper(1200, 60, 0xFF4444, 0x404040);
        this.scene.add(helper);
    },
}


const init = () => {

    canvas = document.getElementById('canvas')
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xCCE0FF);
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    camera = new THREE.PerspectiveCamera( 120, 1000/500, 1, 200  );
    camera.position.set( 0, 3, 5 );
    scene.add( camera );

    document.getElementById("ctx").onchange = event => updateCameraPosition(event, "x")
    document.getElementById("cty").onchange = event => updateCameraPosition(event, "y")
    document.getElementById("ctz").onchange = event => updateCameraPosition(event, "z")
    document.getElementById("ami").onclick = event  => updateLight(event,"ami")
    document.getElementById("dir").onclick = event  => updateLight(event,"dir")

    // lights
    // scene.add( new THREE.AmbientLight( 0x00ff00 ) );
    amlight = new THREE.AmbientLight( 0x00ff00 );
    scene.add(amlight);

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


    const ballGeometry = new THREE.SphereGeometry( 1, 32, 32 );
    const ballMaterial = new THREE.MeshLambertMaterial( {map:footballTexture,
                                                            side: THREE.DoubleSide,
                                                            alphaTest: 0.5} );

    let ball = new THREE.Mesh( ballGeometry, ballMaterial );
    ball.position.set(0, 1, 0);
    ball.castShadow = true;
    scene.add( ball );

    ball.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                                                  depthPacking: THREE.RGBADepthPacking,
                                                                  map: footballTexture,
                                                                  alphaTest: 0.5
                                                              } );



    // const objLoader2 = new OBJLoader2();
    // const name = "bench";
    //
    // const callbackOnLoad = function ( object3d ) {
    //
    //     scope.scene.add( object3d );
    //     console.log( 'Loading complete: ' + name);
    //     scope._reportProgress( { detail: { text: '' } } );
    //
    //     objLoader2.load( 'textures/bench.obj', callbackOnLoad, null, null, null );
    //
    // };


    const animate = function () {
        requestAnimationFrame( animate );

        ball.rotation.x += 0.01;
        ball.rotation.y += 0.01;

        render();
    };
    animate();
}

// const app = new OBJLoader2Example( document.getElementById( 'canvas' ) );

function render() {
    renderer.render(scene, camera);
    // app.render();

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

const addShape = () => {
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
        const addBallGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
        const newBallMaterial = new THREE.MeshLambertMaterial( {map:footballTexture,
                                                                side: THREE.DoubleSide,
                                                                alphaTest: 0.5} );
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