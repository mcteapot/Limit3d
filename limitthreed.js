// Arjun prakash
// Limit in 3D using three.js in javascript




// ## variables
var startTime	= Date.now();
var container;
var camera, scene, renderer, stats;
var planeLimitMid, planeLimitPos, planeLimitNeg;
var cylinderEpsilon;

var gui = new DAT.GUI();


var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var objectRotationY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var dataControl = new DataContainer('the limit');

// ## data container 
function DataContainer(message) {

	this.message = message;
	this.size = 100;
	this.x = 0;
	this.y = 10;
	this.z = 1;
	this.yPosStart = -40;
	this.yMidStart = -40
	this.yNegStart = -40;
	this.radiusE = 5;
	this.resets = function() {
		window.location.reload();
	}
}
gui.add(dataControl, 'y', 0.1, 100, 0.01);
gui.add(dataControl, 'resets').name('RESET THIS SHIT!'); 
// ## Initialize everything
function init() {
	//Setup GUI Control



	// test if webgl is supported
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	// create the camera
	camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 350;
	camera.position.y = 40;
	// create the Scene
	scene = new THREE.Scene();
	//create grid
	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - 500, 0, 0 ) ) );
	geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 500, 0, 0 ) ) );

	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.5 } );

	for ( var i = 0; i <= 10; i ++ ) {

		var line = new THREE.Line( geometry, material );
		line.position.z = ( i * 100 ) - 500;
		scene.addObject( line );

		var line = new THREE.Line( geometry, material );
		line.position.x = ( i * 100 ) - 500;
		line.rotation.y = 90 * Math.PI / 180;
		scene.addObject( line );

	}
	

	// create the onjects
	planeLimitPos = new THREE.Mesh( new THREE.CubeGeometry( 250, 0.1, 200 ), [ new THREE.MeshBasicMaterial( { color: 0xFF000D, opacity: 0.5 } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );
	planeLimitPos.position.y = dataControl.yPosStart;

	planeLimitMid = new THREE.Mesh( new THREE.CubeGeometry( 250, 0.1, 200 ), [ new THREE.MeshBasicMaterial( { color: 0x00B7FF, opacity: 0.5 } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ]);
	planeLimitMid.position.y = dataControl.yMidStart;

	planeLimitNeg = new THREE.Mesh( new THREE.CubeGeometry( 250, 0.1, 200 ), [ new THREE.MeshBasicMaterial( { color: 0xB0FF00, opacity: 0.5 } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );
	planeLimitNeg.position.y = dataControl.yNegStart;
	
	cylinderEpsilon = new THREE.Mesh ( new THREE.CylinderGeometry (50, dataControl.radiusE, dataControl.radiusE, 200),   new THREE.MeshBasicMaterial( { color: 0xFF6F00, opacity: 0.2 } ) );
	cylinderEpsilon.rotation.x = Math.PI/2;

	

	
	// add the object to the scene
	scene.addObject( planeLimitMid );
	scene.addObject( planeLimitPos );
	scene.addObject( planeLimitNeg );
	scene.addObject( cylinderEpsilon );

	// create the container element
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	
	// init the Stats and append it to the Dom - performance vuemeter
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

		
// ## Mouse Events
function onDocumentMouseDown( event ) {

	event.preventDefault();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;

	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}

function onDocumentMouseUp( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

	}
}

// ## Animate and Display the Scene
function animate() {
	// render the 3D scene
	render();
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
	// update the stats
	stats.update();
}


// ## Render the 3D Scene
function render() {
	
	
	objectRotationY += ( targetRotation - objectRotationY ) * 0.05;
	//rotate onjects
	planeLimitMid.rotation.y = objectRotationY;
	planeLimitPos.rotation.y = objectRotationY;
	planeLimitNeg.rotation.y = objectRotationY;

	//Limit distance
	planeLimitPos.position.y = dataControl.yPosStart + dataControl.y;
	planeLimitNeg.position.y = dataControl.yNegStart - dataControl.y;
	if( ( dataControl.radiusE * ( dataControl.y / 50 )) >= .2) {
	cylinderEpsilon.scale.y = dataControl.radiusE * (dataControl.y / 50);
	cylinderEpsilon.scale.x =  dataControl.radiusE * (dataControl.y / 50);
	//cylinderEpsilon.topRad = 30;
	} else {
	cylinderEpsilon.scale.y = .2;
	cylinderEpsilon.scale.x =  .2;
	}	
	// get time
	var dtime	= Date.now() - startTime;

	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}


// ## bootstrap functions
// initialiaze everything
init();
// make it move			
animate();