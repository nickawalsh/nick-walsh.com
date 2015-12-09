/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Invert shader
 */

THREE.InvertShader = {

  uniforms: {

    "tDiffuse": { type: "t", value: null },
    "color":    { type: "c", value: new THREE.Color( 0xffffff ) }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.8 );",

    "}"

  ].join( "\n" ),

  fragmentShader: [

    "uniform vec3 color;",
    "uniform sampler2D tDiffuse;",

    "varying vec2 vUv;",

    "void main() {",

      "vec4 texel = texture2D( tDiffuse, vUv );",

      "vec3 luma = vec3( 0.299, 0.587, 0.114 );",
      "float v = dot( texel.xyz, luma );",

      "gl_FragColor = vec4(1.0-texel.r, 1.0-texel.g, 1.0-texel.b, texel.a);",

    "}"

  ].join( "\n" )

};
