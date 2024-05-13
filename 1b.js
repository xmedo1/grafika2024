console.error('works');

const vertexShaderTxt = `
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

void main() {
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

const fragmentShaderTxt = `
precision mediump float;

varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

const Hexagon = function () {
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [1.0, 1.0, 0.5];

    checkGl(gl);

    gl.clearColor(...canvasColor, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    let hexagonVerts = [
        0.0,     0.0,     1.0,  0.0,  0.0,
        0.5,     0.0,     1.0,  0.0,  0.0,
        0.25,    0.433,   1.0,  0.0,  0.0,
       -0.25,    0.433,   1.0,  0.0,  0.0,
       -0.5,     0.0,     1.0,  0.0,  0.0, 
       -0.25,   -0.433,   1.0,  0.0,  0.0, 
        0.25,   -0.433,   1.0,  0.0,  0.0, 
        0.5,     0.0,     1.0,  0.0,  0.0  
    ];

    const hexagonVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVerts), gl.STATIC_DRAW);

    const posAttrLoc = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrLoc,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(posAttrLoc);

    const colorAttrLoc = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttrLoc,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(colorAttrLoc);

    // render time

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
}

function checkGl(gl) {
    if (!gl) { console.log('WebGL not supported, use another browser'); }
}

function checkShaderCompile(gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('shader not compiled', gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    }
}
