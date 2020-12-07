const loader = new THREE.TextureLoader();


let grass = 'textures/grass.jpg';
let grassTexture = loader.load(grass);
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set( 2, 2 );
grassTexture.anisotropy = 16;
grassTexture.encoding = THREE.sRGBEncoding;

let football = 'textures/football2.jpg';
let footballTexture = loader.load(football);



