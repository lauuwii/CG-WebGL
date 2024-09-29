window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let currentColor = [1.0, 1.0, 1.0, 1.0];

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform vec4 clr;
        void main() {
            gl_FragColor = clr;
        }
    `;
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');

    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -0.7,  0.5,
         0.7,  0.5,
        -0.7, -0.5,
         0.7, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    gl.useProgram(shaderProgram);

    const colorLocation = gl.getUniformLocation(shaderProgram, 'clr');

    function drawScene(color) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform4fv(colorLocation, color);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    drawScene(currentColor);
    document.getElementById('button1').addEventListener('click', function() {
        currentColor = [1.0, 0.0, 0.0, 1.0];
        drawScene(currentColor);
    });

    document.getElementById('button2').addEventListener('click', function() {
        currentColor = [0.0, 1.0, 0.0, 1.0];
        drawScene(currentColor);
    });

    document.getElementById('button3').addEventListener('click', function() {
        currentColor = [0.0, 0.0, 1.0, 1.0];
        drawScene(currentColor);
    });

    document.getElementById('resetButton').addEventListener('click', function() {
        currentColor = [1.0, 1.0, 1.0, 1.0];  
        drawScene(currentColor);
    });
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}