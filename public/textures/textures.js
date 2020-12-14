const loader = new THREE.TextureLoader();


let grass = 'textures/grass.jpg';
let grassTexture = loader.load(grass);
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set( 8, 8 );
grassTexture.anisotropy = 16;
grassTexture.encoding = THREE.sRGBEncoding;

let football = 'textures/football2.jpg';
let footballTexture = loader.load(football);

let basketball = 'textures/basketball.png';
let basketballTexture = loader.load(basketball);

let blueBox = 'textures/blue.jpg';
let blueTexture = loader.load(blueBox);

let yellowBox = 'textures/yellow.jpg';
let yellowTexture = loader.load(yellowBox);




