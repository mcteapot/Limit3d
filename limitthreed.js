// Arjun prakash
// Limit in 3D using three.js in javascript

// ## variables
var startTime	= Date.now();
var container;
var camera, scene, renderer, stats;
var planeLimitMid, planeLimitPos, planeLimitNeg; 
var plane, mesh;
var limHiText, limLoText, limText, radText;

var cylinderEpsilon;

var gui = new DAT.GUI();


var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var objectRotationY = 0;

var mouseX = 0, mouseY = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var limHi = "L+e";
var limLo = "L-e";
var lim = "L";
var rad = "d";


var dataControl = new DataContainer('the limit');

// ## data container 
function DataContainer(message) {

	this.message = message;
	this.size = 100;
	this.x = 0;
	this.y = 30;
	this.z = 1;
	this.yPosStart = 0;
	this.yMidStart = 0
	this.yNegStart = 0;
	this.radiusE = 5;
	this.resets = function() {
		window.location.reload();
	}
}

//Setup GUI Control
gui.add(dataControl, 'y', 0.1, 100, 0.01);
gui.add(dataControl, 'resets').name('RESET'); 

// ## Initialize everything
function init() {

	// test if webgl is supported
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	// create the camera
	camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 350;
	camera.position.y = 40;
	// create the Scene
	scene = new THREE.Scene();
	

	// Text
	var hash = document.location.hash.substr( 1 );

	if ( hash.length !== 0 ) {

		lim = hash;
		limHi = hash;
		limLo = hash;

	}

	function text3d(text) {
	return new THREE.TextGeometry( text, { size: 20, height: 5, curveSegments: 2, font: "helvetiker" });
	}

    var textMaterial = new THREE.MeshBasicMaterial( { color: 0x636363, wireframe: false } );


    limText = new THREE.Mesh( text3d(lim), textMaterial );
    limText.position.x = -220;
    limText.position.y = 0;
	limText.overdraw = true;
    scene.addChild( limText );

    limHiText = new THREE.Mesh( text3d(limHi), textMaterial );
    limHiText.position.x = -220;
    limHiText.position.y = 0;
	limHiText.overdraw = true;
    scene.addChild( limHiText );

    limLoText = new THREE.Mesh( text3d(limLo), textMaterial );
    limLoText.position.x = -220;
    limLoText.position.y = 0;
	limLoText.overdraw = true;
    scene.addChild( limLoText );

    radText = new THREE.Mesh( text3d(rad), textMaterial );
    radText.position.x = 0;
    radText.position.y = -200;
	radText.overdraw = true;
    scene.addChild( radText );


    // Plane
	//var data = generateHeight( 1024, 1024 );
    var data;
	var quality = 17, step = 1024 / quality;
	var plane = new THREE.PlaneGeometry( 250, 250, quality - 1, quality - 1 );
	//var plane = new THREE.PlaneGeometry( 250, 250, 3-1, 7-1 );

	for ( var i = 0, l = plane.vertices.length; i < l; i ++ ) {
	//vetexToCordinates(3-1,7-1,'y',i);
		var xVal = vetexToCordinates(quality-1,quality-1,'x',i);
		var yVal = vetexToCordinates(quality-1,quality-1,'y',i);
	    vetexToCordinates(quality-1,quality-1,'p',i);
	
		var x = i % quality, y = ~~ ( i / quality );
		
		// mathFunctions
		var zPos = (xVal*(Math.pow(yVal,2)))*0.2;
		//var zPos = (Math.pow(xVal,2) + Math.pow(yVal,2))*1;
		//console.log('point Z:' + zPos);
		plane.vertices[ i ].position.z = zPos;
		
	}
	mesh = new THREE.Mesh( plane, [ new THREE.MeshBasicMaterial( { color: 0x636363, opacity: 1.0 } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );
	mesh.rotation.x = -90 * Math.PI / 180;
	mesh.overdraw = true;
    mesh.doubleSided = true;
	scene.addObject( mesh );

	// create the onjects
	planeLimitPos = new THREE.Mesh( new THREE.CubeGeometry( 250, 0.01, 250 ), [ new THREE.MeshBasicMaterial( { color: 0xFF000D, opacity: 0.5 } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );
	planeLimitPos.position.y = dataControl.yPosStart;

	planeLimitMid = new THREE.Mesh( new THREE.CubeGeometry( 250, 0.1, 250 ), [ new THREE.MeshBasicMaterial( { color: 0x00B7FF, opacity: 0.5 } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );
	planeLimitMid.position.y = dataControl.yMidStart;

	planeLimitNeg = new THREE.Mesh( new THREE.CubeGeometry( 250, 0.1, 250 ), [ new THREE.MeshBasicMaterial( { color: 0xB0FF00, opacity: 0.5 } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );
	planeLimitNeg.position.y = dataControl.yNegStart;
	
	cylinderEpsilon = new THREE.Mesh ( new THREE.CylinderGeometry (50, dataControl.radiusE, dataControl.radiusE, 400),   new THREE.MeshBasicMaterial( { color: 0x00B7FF, opacity: 0.2 } ) );
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
	mouseY = event.clientY - windowHalfY;

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
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

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
	camera.position.y += (  -mouseY + 200 - camera.position.y ) * .05;
	
	objectRotationY += ( targetRotation - objectRotationY ) * 0.05;
	//rotate onjects
	planeLimitMid.rotation.y = objectRotationY;
	planeLimitPos.rotation.y = objectRotationY;
	planeLimitNeg.rotation.y = objectRotationY;
	mesh.rotation.z = objectRotationY;

	//Limit distance
	planeLimitPos.position.y = dataControl.yPosStart + dataControl.y;
	limHiText.position.y = dataControl.yPosStart + dataControl.y;

	planeLimitNeg.position.y = dataControl.yNegStart - dataControl.y;
	limLoText.position.y = dataControl.yPosStart - dataControl.y;

	radText.position.x = dataControl.yPosStart + dataControl.y;


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

// ## Vertex points to courdinates
function vetexToCordinates(xRow, yRow, variable, vertex) {
  var totalPoints = (xRow + 1) * (yRow + 1);

	//console.log("proper x and y rows");
	if(vertex < totalPoints) {
		//console.log("vertex in range");
		var multiplyer = xRow + 1;
		//console.log("multiplyer:" + multiplyer);
	
		var xStart = -(yRow/2);
		var yStart = -(xRow/2);
		//console.log('start point(' + xStart + ',' + yStart + ')');
	
	  
		var xAdd = vertex / multiplyer;
		var yAdd = vertex % multiplyer;
	  
		var xOutput = xStart + Math.floor(xAdd);
		var yOutput = yStart + Math.floor(yAdd);
		if(variable.toLowerCase() === 'x') {
			return xOutput;
		} else if(variable.toLowerCase() === 'y') {
			return yOutput;
		} else if(variable.toLowerCase() === 'p') { 
			//console.log('point(' + xOutput + ',' + yOutput + ')');

		} else {
			//console.log('unknown variable');
		}
	}
}



// ## bootstrap functions
// initialiaze everything
init();
// make it move			
animate();


