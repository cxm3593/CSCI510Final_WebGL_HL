  'use strict';



  // import "dist/webgl-obj-loader.js";\
  // import {Mesh} from 'webgl-obj-loader-master\dist\webgl-obj-loader.js'

  // Global variables that are set and used
  // across the application
  let gl;

  // GLSL programs
  let shaderProgram;

  // VAOs for the objects
  var mySphere = null;

  // textures
  let test_texture;
  let floor_texture;
  let wall_texture;
  let table_texture;
  let computer_texture;
  let board_texture;
  let crowbar_texture;

  // rotation
  let cameraOffsetZ = 0;
  let cameraOffsetX = 0;
  

  // Mesh Objects:
  var appMeshes = {};
  let myModel = null;
  let floorModel = null
  let wallModel = null;
  let tableModel = null;
  let rWallModel = null;
  let computerModel = null;
  let boardModel = null;
  let crowbarModel = null;

//

function loadMeshes(meshes) {
	appMeshes = meshes;

	myModel = appMeshes['testModel'];
	myModel.VAO = bindMeshVAO(myModel, shaderProgram);

	floorModel = appMeshes['floor'];
	floorModel.VAO = bindMeshVAO(floorModel, shaderProgram);

	wallModel = appMeshes['wall'];
	wallModel.VAO = bindMeshVAO(wallModel, shaderProgram);

	tableModel = appMeshes['table'];
	tableModel.VAO = bindMeshVAO(tableModel, shaderProgram);

	rWallModel = appMeshes['rwall'];
	rWallModel.VAO = bindMeshVAO(rWallModel, shaderProgram);

	computerModel = appMeshes['computer'];
	computerModel.VAO = bindMeshVAO(computerModel, shaderProgram);

	boardModel = appMeshes['board'];
	boardModel.VAO = bindMeshVAO(boardModel, shaderProgram);


	draw();
	//console.log(myModel);
}


// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {

	mySphere = new Sphere(20, 20);
	mySphere.VAO = bindVAO (mySphere, shaderProgram);


	// load all models from server
	OBJ.downloadMeshes(
		{
			'testModel' : 'model/test_model.obj',
			'floor' : 'model/Floor.obj',
			'wall' : 'model/Wall.obj',
			'table' : 'model/Table.obj',
			'rwall' : 'model/RightWall.obj',
			'computer' : 'model/Computer.obj',
			'board' : 'model/Board.obj',
		},
		loadMeshes
	);

}


//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
    
    gl.useProgram (program);
    
    // set up your projection
	let projMatrix = glMatrix.mat4.create();
	glMatrix.mat4.perspective(projMatrix, 0.7, 1.0, 1.0, 300.0);
	gl.uniformMatrix4fv (program.uProjT, false, projMatrix);
    
    // set up your view
	let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [-2.0 + cameraOffsetX, 0.0, -10 + cameraOffsetZ], [-1, 0.0, -4], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);

}


//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures(){
    
    // flip Y for WebGL
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
    
    // get some texture space from the gpu

	// load test texture
	gl.activeTexture(gl.TEXTURE0);
	test_texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, test_texture);
    var testImage = document.getElementById ('test-texture');
    testImage.crossOrigin = "";

	testImage.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, test_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, testImage.width, testImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, testImage);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		draw();
	}


	// load floor texture
	gl.activeTexture(gl.TEXTURE1);
	floor_texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, floor_texture);
	var floorImage = document.getElementById('floor-texture');
	floorImage.crossOrigin = "";
	floorImage.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, floor_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, floorImage.width, floorImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, floorImage);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		draw();
	}

	// wall texture
	gl.activeTexture(gl.TEXTURE2);
	wall_texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, wall_texture);
	var wallImage = document.getElementById('wall-texture');
	wallImage.crossOrigin = "";
	wallImage.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, wall_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, wallImage.width, wallImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, wallImage);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		draw();
	}

	// table texture
	gl.activeTexture(gl.TEXTURE3);
	table_texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, table_texture);
	var tableImage = document.getElementById('table-texture');
	tableImage.crossOrigin = "";
	tableImage.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, table_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tableImage.width, tableImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, tableImage);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		draw();
	}

	gl.activeTexture(gl.TEXTURE4);
	computer_texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, computer_texture);
	var computerImage = document.getElementById('computer-texture');
	computerImage.crossOrigin = "";
	computerImage.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, computer_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, computerImage.width, computerImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, computerImage);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		draw();
	}

	gl.activeTexture(gl.TEXTURE5);
	board_texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, board_texture);
	var boardImage = document.getElementById('board-texture');
	boardImage.crossOrigin = "";
	boardImage.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, board_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, boardImage.width, boardImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, boardImage);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		draw();
	}



        
    // bind the texture so we can perform operations on it
    
    // load the texture data
        
    // set texturing parameters
}


//
//  This function draws all of the shapes required for your scene
//
    function drawShapes() {
        gl.useProgram(shaderProgram);

		// // draw testing model
		// if(myModel != null){
		// 	let modelMatrix = glMatrix.mat4.create();
		// 	glMatrix.mat4.translate(modelMatrix, modelMatrix, [1.0, 0.0, 0.0]);
    	// 	gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
		// 	gl.activeTexture (gl.TEXTURE0);
		// 	gl.bindTexture(gl.TEXTURE_2D, test_texture);
		// 	gl.uniform1i(shaderProgram.uTheTexture, 0);
		// 	gl.bindVertexArray(myModel.VAO);
		// 	gl.drawElements(gl.TRIANGLES, myModel.indices.length, gl.UNSIGNED_SHORT, 0);
		// }

		if(floorModel != null){
			let modelMatrix = glMatrix.mat4.create();
			glMatrix.mat4.translate(modelMatrix, modelMatrix, [0.0, -2.3, -12.0]);
			glMatrix.mat4.scale(modelMatrix, modelMatrix, [10.0, 10.0, 10.0])
			gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
			gl.activeTexture (gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, floor_texture);
			gl.uniform1i(shaderProgram.uTheTexture, 1);
			gl.bindVertexArray(floorModel.VAO);
			gl.drawElements(gl.TRIANGLES, floorModel.indices.length, gl.UNSIGNED_SHORT, 0);
		}

		// draw ceiling
		if(floorModel != null){
			let modelMatrix = glMatrix.mat4.create();
			glMatrix.mat4.translate(modelMatrix, modelMatrix, [0.0, 3.0, -12.0]);
			glMatrix.mat4.scale(modelMatrix, modelMatrix, [10.0, 10.0, 10.0]);
			glMatrix.mat4.rotate(modelMatrix, modelMatrix, 3.14, [0.0, 0.0, 1.0]);
			gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
			gl.activeTexture (gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, floor_texture);
			gl.uniform1i(shaderProgram.uTheTexture, 1);
			gl.bindVertexArray(floorModel.VAO);
			gl.drawElements(gl.TRIANGLES, floorModel.indices.length, gl.UNSIGNED_SHORT, 0);
		}

		// draw wall
		if(wallModel != null) {
			let modelMatrix = glMatrix.mat4.create();
			glMatrix.mat4.scale(modelMatrix, modelMatrix, [0.8, 0.6, 0.8]);
			glMatrix.mat4.translate(modelMatrix, modelMatrix, [0.0, -1.2, 10.0]);
			glMatrix.mat4.rotate(modelMatrix, modelMatrix, 3.14, [0.0, 1.0, 0.0]);


			gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
			gl.activeTexture (gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, wall_texture);
			gl.uniform1i(shaderProgram.uTheTexture, 2);
			gl.bindVertexArray(wallModel.VAO);
			gl.drawElements(gl.TRIANGLES, wallModel.indices.length, gl.UNSIGNED_SHORT, 0);
		}

		// draw table
		if(tableModel != null) {
			let modelMatrix = glMatrix.mat4.create();
			glMatrix.mat4.translate(modelMatrix, modelMatrix, [-1.5, -1.5, -4.0]);
			glMatrix.mat4.scale(modelMatrix, modelMatrix, [1.5, 1.2, 1.2]);
			glMatrix.mat4.rotate(modelMatrix, modelMatrix, 3.14, [0.0, 1.0, 0.0]);
			gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
			gl.activeTexture (gl.TEXTURE3);
			gl.bindTexture(gl.TEXTURE_2D, table_texture);
			gl.uniform1i(shaderProgram.uTheTexture, 3);
			gl.bindVertexArray(tableModel.VAO);
			gl.drawElements(gl.TRIANGLES, tableModel.indices.length, gl.UNSIGNED_SHORT, 0);
		}

		// draw rwall
		if(rWallModel != null) {
			let modelMatrix = glMatrix.mat4.create();
			glMatrix.mat4.translate(modelMatrix, modelMatrix, [-15, -2.0, 20.0]);
			glMatrix.mat4.rotate(modelMatrix, modelMatrix, 1.6, [0.0, 1.0, 0.0]);


			gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
			gl.activeTexture (gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, wall_texture);
			gl.uniform1i(shaderProgram.uTheTexture, 2);
			gl.bindVertexArray(rWallModel.VAO);
			gl.drawElements(gl.TRIANGLES, rWallModel.indices.length, gl.UNSIGNED_SHORT, 0);
		}

		// draw computer
		if(computerModel != null){
			let modelMatrix = glMatrix.mat4.create();
			glMatrix.mat4.translate(modelMatrix, modelMatrix, [-2.4, -0.8, -4.8]);
			glMatrix.mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
			glMatrix.mat4.rotate(modelMatrix, modelMatrix, 2.1, [0.0, 1.0, 0.0]);


			gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
			gl.activeTexture(gl.TEXTURE4);
			gl.bindTexture(gl.TEXTURE_2D, computer_texture);
			gl.uniform1i(shaderProgram.uTheTexture, 4);
			gl.bindVertexArray(computerModel.VAO);
			gl.drawElements(gl.TRIANGLES, computerModel.indices.length, gl.UNSIGNED_SHORT, 0);
		}

		//draw board
		if(boardModel != null) {
			let modelMatrix = glMatrix.mat4.create();
			glMatrix.mat4.scale(modelMatrix, modelMatrix, [0.3, 0.3, 0.3]);
			
			
			gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
			gl.activeTexture(gl.TEXTURE5);
			gl.bindTexture(gl.TEXTURE_2D, board_texture);
			gl.uniform1i(shaderProgram.uTheTexture, 5);
			gl.bindVertexArray(boardModel.VAO);
			gl.drawElements(gl.TRIANGLES, boardModel.indices.length, gl.UNSIGNED_SHORT, 0);
		}

		// if(crowbarModel != null) {
		// 	let modelMatrix = glMatrix.mat4.create();
			
		// 	gl.uniformMatrix4fv (shaderProgram.uModelT, false, modelMatrix);
		// 	gl.activeTexture(gl.TEXTURE6);
		// 	gl.bindTexture(gl.TEXTURE_2D, crowbar_texture);
		// 	gl.uniform1i(shaderProgram.uTheTexture, 6);
		// 	gl.bindVertexArray(crowbarModel.VAO);
		// 	gl.drawElements(gl.TRIANGLES, crowbarModel.indices.length, gl.UNSIGNED_SHORT, 0);
		// }
    }


  //
  // Use this function to create all the programs that you need
  // You can make use of the auxillary function initProgram
  // which takes the name of a vertex shader and fragment shader
  //
  // Note that after successfully obtaining a program using the initProgram
  // function, you will beed to assign locations of attribute and unifirm variable
  // based on the in variables to the shaders.   This will vary from program
  // to program.
  //
  function initPrograms() {
    	shaderProgram = initProgram("phong-V", "phong-F");
		setUpIllumination(shaderProgram);
		setUpTextures();
		setUpCamera(shaderProgram);


  }

  function setUpIllumination(program) {

		gl.useProgram(program);

		let ambientLight_vec3 = glMatrix.vec3.fromValues(0.7, 0.7, 0.7);
		gl.uniform3fv (program.ambientLight, ambientLight_vec3);
		let lightPos_vec3 = glMatrix.vec3.fromValues(0.0, 3.0, -1.0);
		gl.uniform3fv (program.lightPosition, lightPos_vec3);
		let lightColor_vec3 = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
		gl.uniform3fv(program.lightColor, lightColor_vec3);

		let baseColor_vec3 = glMatrix.vec3.fromValues(1.0, 0.1, 0.1);
		gl.uniform3fv(program.baseColor, baseColor_vec3);
		let specHighlightColor_vec3 = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
		gl.uniform3fv(program.specHighlightColor, specHighlightColor_vec3);

		let ka = 0.9; // ambient coefficient
		let kd = 0.8; // diffuse coefficient
		let ks = 0.7; // specular coefficient
		let ke = 5.0; // spectral exponent;
		gl.uniform1f(program.ka, ka);
		gl.uniform1f(program.kd, kd);
		gl.uniform1f(program.ks, ks);
		gl.uniform1f(program.ke, ke);

  }


  // creates a VAO and returns its ID
  function bindVAO (shape, program) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

	   // Edited: Normal
		let Normal_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, Normal_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.normals), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(program.aNormal);
		gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
      
      // add code for any additional vertex attribute
	  let uvBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
	  gl.enableVertexAttribArray(program.aUV);
	  gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);

      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
  }

  function bindMeshVAO(mesh, program){
	let theVAO = gl.createVertexArray();
	gl.bindVertexArray(theVAO);

	let myVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(program.aVertexPosition);
	gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

	let Normal_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Normal_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(program.aNormal);
	gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);

	let uvBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(program.aUV);
	gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);

	let myIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

	// Clean
	gl.bindVertexArray(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	return theVAO;
  }


/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


  //
  // compiles, loads, links and returns a program (vertex/fragment shader pair)
  //
  // takes in the id of the vertex and fragment shaders (as given in the HTML file)
  // and returns a program object.
  //
  // will return null if something went wrong
  //
  function initProgram(vertex_id, fragment_id) {
    const vertexShader = getShader(vertex_id);
    const fragmentShader = getShader(fragment_id);

    // Create a program
    let program = gl.createProgram();
      
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }

	// Edited: Setup Uniform locations
	// Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aNormal = gl.getAttribLocation(program, 'aNormal');
	program.aUV = gl.getAttribLocation(program, 'aUV');
      
    // uniforms
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
    program.ambientLight = gl.getUniformLocation (program, 'ambientLight');
    program.lightPosition = gl.getUniformLocation (program, 'lightPosition');
    program.lightColor = gl.getUniformLocation (program, 'lightColor');
    program.baseColor = gl.getUniformLocation (program, 'baseColor');
    program.specHighlightColor = gl.getUniformLocation (program, 'specHighlightColor');
    program.ka = gl.getUniformLocation (program, 'ka');
    program.kd = gl.getUniformLocation (program, 'kd');
    program.ks = gl.getUniformLocation (program, 'ks');
    program.ke = gl.getUniformLocation (program, 'ke');

	// texture uniform
	program.uTheTexture = gl.getUniformLocation (program, 'theTexture');
	program.uvScale = gl.getUniformLocation(program, 'uvScale');
      
    return program;
  }


  //
  // We call draw to render to our canvas
  //
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
	// deal with keypress
	window.addEventListener('keydown', gotKey ,false);
      
	// Set the clear color to be black
	gl.clearColor(0, 0, 0, 1);
	  
	// some GL initialization
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	
	gl.cullFace(gl.BACK);
	gl.frontFace(gl.CCW);
	gl.clearColor(0.0,0.0,0.0,1.0)
	gl.depthFunc(gl.LEQUAL)
	gl.clearDepth(1.0)

	// Read, compile, and link your shaders
	initPrograms();
	
	// create and bind your current object
	createShapes();
	
	// do a draw
	setUpIllumination(shaderProgram);
	draw();
    
  }

