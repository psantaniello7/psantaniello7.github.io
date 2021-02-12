			import * as THREE from './three.module.js';
			import {GLTFLoader} from'./GLTFLoader.js';
			import {CanvasUI} from './libs/CanvasUI.js';

			let container;
			let camera, scene, renderer;
			let controller;
			let reticle;
			let clock;
			let root;
			let modelInScene;
			let loadButtonInScene;
			let unboxButtonInScene;
			let uiButton;
			let delta;
			let overlay;
			let threeDButton;
			let mixer;
            let ui;
			let workingMatrix = new THREE.Matrix4();
			let raycaster = new THREE.Raycaster();
            let self;


			let hitTestSource = null;
			let hitTestSourceRequested = false;
            
            
			init();
			animate();
            

			function init() {
				clock = new THREE.Clock();
				modelInScene = false;
				loadButtonInScene = false;
				unboxButtonInScene = false;
				overlay = document.getElementById('overlaid');

				container = document.createElement( 'div' );
				document.body.appendChild( container );
				scene = new THREE.Scene();
				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

				const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
				light.position.set( 0.5, 1, 0.25 );
				scene.add( light );

				//

				

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.xr.enabled = true;
				container.appendChild( renderer.domElement );

				//

				document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );

				//
				
				const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );

				function onSelect() {

					if ( reticle.visible ) {
						loadModel();

						

					}

				}

				controller = renderer.xr.getController( 0 );
				controller.addEventListener( 'select', onSelect );
				scene.add( controller );

				reticle = new THREE.Mesh(
					new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
					new THREE.MeshBasicMaterial()
				);
				reticle.matrixAutoUpdate = false;
				reticle.visible = false;
				scene.add( reticle );
				//
                createUI();
                                console.log('button1');
                ui.mesh.position.set(0, 0, -1);
                console.log('button2');
                camera.attach(ui.mesh);
                ui.panelSize.width = 0.1;
                ui.panelSize.height = 0.1;
                console.log(ui.panelSize.width);
                
                ui.update();

				window.addEventListener( 'resize', onWindowResize );

			}


            function createUI() {
               const config = {
            header:{
                type: "text",
                position:{ top:0 },
                paddingTop: 30,
                height: 70
            },
            main:{
                type: "text",
                position:{ top:70 },
                height: 372, // default height is 512 so this is 512 - header height:70 - footer height:70
                backgroundColor: "#bbb",
                fontColor: "#000"
            },
            footer:{
                type: "text",
                position:{ bottom:0 },
                paddingTop: 30,
                height: 70
            }
        }
        const content = {
            header: "Header",
            main: "This is the main text",
            footer: "Footer"
        }
        ui = new CanvasUI( content, config ); 

              
            }

			function loadButtonUI (string) {

				if (loadButtonInScene == true) {

					return;
				}
			
				uiButton = document.createElement('button');
				uiButton.setAttribute('class', 'UIButton');
				uiButton.setAttribute('style', 'z-index: 10')
				uiButton.textContent = string;
				uiButton.style.display = '';
				uiButton.style.cursor = 'pointer';
				document.body.appendChild(uiButton);
				loadButtonInScene = true;
				uiButton.onclick = function () {

					if (modelInScene == false)
						loadModel();
						document.body.removeChild(uiButton);
						unboxButtonUI('Unbox Product');
				};

			}

			function unboxButtonUI (string) {
				if (unboxButtonInScene == true) {
					return;
				}
				uiButton = document.createElement('button');
				uiButton.setAttribute('class', 'UIButton');
				uiButton.textContent = string;
				uiButton.style.display = '';
				uiButton.style.cursor = 'pointer';
				document.body.appendChild(uiButton);
				unboxButtonInScene = true;

				uiButton.onclick = function () {
					animation();
					document.body.removeChild(uiButton);
				}

			}

			function setupModel(data) {

				data.scene.traverse(function (object) {
			  	if(object.isMesh){ object.castShadow = true;}
			  });

			  const model = data.scene.children[0];
			  const clip = data.animations[0];
			  mixer = new THREE.AnimationMixer(model);
			  const action = mixer.clipAction(clip);
			  action.clampWhenFinished = true;
			  action.loop = THREE.LoopOnce;
			  action.play();

			  model.position.setFromMatrixPosition( reticle.matrix );

			  model.receiveShadow = false;

			  return model;
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			async function loadModel() {
				if (modelInScene == true) {
					return;
				}
				const loader = new GLTFLoader();

				const [modelData] = await Promise.all([
					loader.loadAsync('./models/unbox_glb.glb'),
					]);

				
				
				root = setupModel(modelData)
				root.scale.x = 0.01;
				root.scale.y = 0.01;
				root.scale.z = 0.01;

				scene.add(root)
                createUI();
				modelInScene = true;
			}



			function animation() {
				requestAnimationFrame(animation);
				let mixerUpdateDelta = clock.getDelta();
				mixer.update(mixerUpdateDelta);
			}

			//

			function animate() {

				renderer.setAnimationLoop( render );


			}

			function render( timestamp, frame ) {
                if (renderer.xr.isPresenting){ui.update();}
				if ( frame ) {

					const referenceSpace = renderer.xr.getReferenceSpace();
					const session = renderer.xr.getSession();

					if ( hitTestSourceRequested === false ) {

						session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {

							session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

								hitTestSource = source;

							} );

						} );

						session.addEventListener( 'end', function () {

							hitTestSourceRequested = false;
							hitTestSource = null;

						} );

						hitTestSourceRequested = true;

					}
					
					if ( hitTestSource ) {

						const hitTestResults = frame.getHitTestResults( hitTestSource );

						if ( hitTestResults.length ) {

							const hit = hitTestResults[ 0 ];
							if (unboxButtonInScene == true) {
						reticle.visible = false;
					} else {
						if (modelInScene == false) {
							reticle.visible = true;
						reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );
						} else {

							reticle.visible = false;
						}
						
							

							
					}

						} else {

							reticle.visible = false;

						}

					}

				}



				renderer.render( scene, camera );

			}