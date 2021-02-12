import * as THREE from '../../libs/three/three.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { GLTFLoader } from '../../libs/three/jsm/GLTFLoader.js';
import { Stats } from '../../libs/stats.module.js';
import { CanvasUI } from '../../libs/CanvasUI.js'
import { ARButton } from '../../libs/ARButton.js'; 
import { DRACOLoader } from '../../libs/three/jsm/DRACOLoader.js'
import {
	Constants as MotionControllerConstants,
	fetchProfile
} from '../../libs/three/jsm/motion-controllers.module.js';

const DEFAULT_PROFILES_PATH = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles';
const DEFAULT_PROFILE = 'generic-trigger';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
        this.assetsPath = './models/';
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
		
		this.scene = new THREE.Scene();
        
        this.scene.add ( this.camera );
       
		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();
        
        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );
        
        this.origin = new THREE.Vector3();
        this.quaternion = new THREE.Quaternion();
        this.euler = new THREE.Euler();
        
        this.initScene();
        this.setupXR();
        
        this.currentState = "Open";
        this.modelInScene = false;
        this.isUnboxed = false;
        
        window.addEventListener('resize', this.resize.bind(this) );
	}
    
    initReticle() {
        let ring = new THREE.RingBufferGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 );
        const reticle = new THREE.Mesh(ring, new THREE.MeshBasicMaterial());
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        return reticle;
    }
    
    initScene(){
        this.reticle = this.initReticle();
        this.scene.add(this.reticle);
        this.mixers = [];
        this.createUI();
    }
    
    createUI () {
        const self = this;
        
        function onPress(){
            if (self.currentState == "Open") {
                self.loadModel();
                self.currentState = "Placed"
                self.ui.updateElement("info", "Open Product");
            } 
            else if (self.currentState == "Placed") {
                self.unboxProduct();
//                self.currentState = "Unboxed";
//                self.ui.updateElement("info", "Next");
            }
            else if (self.currentState == "Unboxed") {
                if(!self.action.isRunning()){
                self.lineProducts();
                self.CurrentState = "Lined";
                self.ui.updateElement("info", "RESET");
                }
            }
              
        }

        
        const config = {
            panelSize: {width:0.6, height: 0.3},
            height: 200,
            info: {type: "button", position:{left:0, top: 0}, width: 512, height: 200, backgroundColor:"#aaa", fontColor:"#000", onSelect:onPress},

            renderer: this.renderer
        }
        const content = {
            info: "Place Product",
        }
        this.ui = new CanvasUI(content, config);
    }
    
    setupXR(){
        this.renderer.xr.enabled = true; 
        
        const self = this;
        
        function onSessionStart(){
            self.ui.mesh.position.set( 0, -0.5, -1.1 );
            self.camera.add( self.ui.mesh );
        }
        
        function onSessionEnd(){
            self.camera.remove( self.ui.mesh );
        }

        const btn = new ARButton( this.renderer, { onSessionStart, onSessionEnd, sessionInit: { requiredFeatures: [ 'hit-test' ], optionalFeatures: [ 'dom-overlay' ], domOverlay: { root: document.body } } } ); 
        
        this.hitTestSourceRequested = false;
        this.hitTestSource = null;
        
        
        const controller = this.renderer.xr.getController( 0 );
        
        this.scene.add( controller );
        this.controller = controller;
        
        this.renderer.setAnimationLoop( this.render.bind(this) );

    }
    
    showUI() {
            self.ui.mesh.position.set( 0, -0.5, -1.1 );
            self.camera.add( self.ui.mesh );
        }
        
    loadModel() {
        const self = this;
        
        if (self.modelInScene == true) {
            return;
        }
        
        const loader = new GLTFLoader().setPath(this.assetsPath);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '../../libs/three/js/draco/' );
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            `unbox_glb.glb`,
            function (gltf) {

                self.model = gltf.scene;
                self.model.position.setFromMatrixPosition( self.reticle.matrix );
                
                self.scene.add(self.model);

                const mixer = new THREE.AnimationMixer(self.model);
                const action = mixer.clipAction(gltf.animations[0]);
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
                self.action = action;
                mixer.addEventListener('finished', function() {
                self.currentState = "Unboxed";
                self.isUnboxed = true;
                self.ui.updateElement("info", "Next");
                });
                self.mixers.push(mixer);

                self.modelInScene = true;
            }

        );
    }
    
    unboxProduct() {
        if ( !this.action.isRunning() ){
            this.action.time = 0;
            this.action.enabled = true;
            this.action.play();
            this.ui.updateElement("info", "");
        }
    }
    
    lineProducts() {
        const self = this
        var obj = self.model;
        obj.traverse(node => {
            console.log(node.name);
            if(node.name == "luna_geo") {
                console.log(node.name);
                console.log(node.position);
                node.position.z = node.position.z - 50;
                console.log(node.position);
            }
            
        })
        
        
        
    }
    
    requestHitTestSource() {
        const self = this;
        
        const session = this.renderer.xr.getSession();
        session.requestReferenceSpace('viewer').then(function (referenceSpace) {
            session.requestHitTestSource({space: referenceSpace}).then(function(source) {
                self.hitTestSource = source;
            });
        });
        
        session.addEventListener('end', function() {
            self.hitTestSourceRequested = false;
            self.hitTestSource = null;
            self.referenceSpace = null;
        });
        
        this.hitTestSourceRequested = true;
    }
    
    getHitTestResults(frame) {
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);
        
        if (hitTestResults.length) {
            const referenceSpace = this.renderer.xr.getReferenceSpace();
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);
            if (this.modelInScene == false){
                this.reticle.visible = true;
            } else this.reticle.visible = false;
//            this.reticle.visible = true;
            this.reticle.matrix.fromArray(pose.transform.matrix);
            this.ui.visible = true;
            
        } else {
            this.reticle.visible = false;
            this.ui.visible = false;
        }
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render(timestamp, frame ) { 
        const self = this;
        
        const dt = this.clock.getDelta();
        this.stats.update();
        this.mixers.forEach( mixer => mixer.update(dt) );
        if (this.renderer.xr.isPresenting){
            const pos = this.controller.getWorldPosition( this.origin );
            this.euler.setFromQuaternion( this.controller.getWorldQuaternion( this.quaternion ) );
            const rot = this.euler;
            this.ui.update();
        }
        
        if (frame) {
            if (this.hitTestSourceRequested === false) this.requestHitTestSource()
            
            if (this.hitTestSource) this.getHitTestResults(frame);
        }
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };



