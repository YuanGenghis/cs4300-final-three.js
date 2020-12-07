let renderer, canvas, scene, camera



const SPHERE = "SPHERE"
const CUBE = "CUBE"



const init = () => {
    canvas = document.getElementById('canvas')
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xCCE0FF);
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    camera = new THREE.PerspectiveCamera( 100, 1000 / 500, 0.1, 200 );
    camera.position.set( 0, 3, 5 );
    scene.add( camera );
   // lights

    scene.add( new THREE.AmbientLight( 0x00ff00 ) );

    const light = new THREE.DirectionalLight( 0xdfebff, 1 );
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

    const geometry = new THREE.BoxBufferGeometry(20,0.1,20);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    const loader = new THREE.TextureLoader();
    const grassTexture = loader.load('textures/Grass.png');
    const grassMaterial = new THREE.MeshLambertMaterial( {
                                                             map: grassTexture,
                                                             side: THREE.DoubleSide,
                                                             alphaTest: 0.5
                                                         } );
    const grassMesh = new THREE.Mesh(geometry, grassMaterial);
    scene.add(grassMesh);

    const SphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
    const SphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    const sphere = new THREE.Mesh( SphereGeometry, SphereMaterial );
    sphere.position.set(0, 1, 0);
    scene.add( sphere );


    render();

}

function render() {
    renderer.render(scene, camera);

}