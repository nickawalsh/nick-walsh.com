var Earth = function(el, data) {
  let camera, scene, renderer, composer, w, h;

  let lines = [],
    points = [],
    rotation = {x: 0, y: Math.PI / 7},
    target = {x: 0, y: Math.PI / 7};

  const center = new THREE.Vector3(0, 0, 0),
    clock = new THREE.Clock(),
    distance = 425,
    pointRadius = 152,
    radius = 150;

  // Shaders
  // https://github.com/dataarts/webgl-globe

  const shaders = {
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 3.0 );',
          'gl_FragColor = vec4( 0.3, 0.4, 0.3, 0.05 ) * intensity;',
        '}'
      ].join('\n')
    }
  };

  // -------------------------------------
  //   Init
  // -------------------------------------

  function init() {
    w = window.innerWidth;
    h = window.innerHeight;

    camera = new THREE.PerspectiveCamera(distance / 10, w / h, 1, distance * 2);
    scene = new THREE.Scene();
    scene.add(camera);

    // Stars
    // http://gielberkers.com/evenly-distribute-particles-shape-sphere-threejs/

    let starGeometry = new THREE.Geometry();

    for (let i = 0; i < 1000; i ++) {
      let x = -1 + Math.random() * 2;
      let y = -1 + Math.random() * 2;
      let z = -1 + Math.random() * 2;
      const d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
      x *= d;
      y *= d;
      z *= d;

      const vertex = new THREE.Vector3(
        x * distance,
        y * distance,
        z * distance
      );
      starGeometry.vertices.push(vertex);
    }

    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({color: '#333333', size: 3}));
    scene.add(stars);

    // Light

    let light = new THREE.PointLight('#ffffff', 0.5);
    camera.add(light);
    light.position.set(distance / 2, distance / 2, 0);
    light.target = camera;

    // Earth

    const earthGeometry = new THREE.SphereGeometry(radius, 50, 30);
    const earthMaterial = new THREE.MeshPhongMaterial({
      bumpMap: new THREE.TextureLoader().load('/assets/images/earth-bump.jpg'),
      bumpScale: 4,
      emissiveMap: new THREE.TextureLoader().load('/assets/images/earth-lights.jpg'),
      emissive: '#333333',
      map: new THREE.TextureLoader().load('/assets/images/earth-lights.jpg'),
      specular: '#010101'
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Atmosphere

    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: shaders['atmosphere'].vertexShader,
      fragmentShader: shaders['atmosphere'].fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
    atmosphere.scale.set(1.3, 1.3, 1.3);
    scene.add(atmosphere);

    // Points

    for (let i = 0; i < data.length; i++) {
      points.push(new point(data[i].lat, data[i].long, data[i].r, i));

      let newLine = drawCurve(points[0].position, points[i].position);

      new TWEEN.Tween(newLine)
        .to({currentPoint: 200}, 2000)
        .delay(i * 350 + 1500)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function() {
          newLine.geometry.setDrawRange(0, newLine.currentPoint);
        })
        .start();
    }

    // Renderer

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);

    // Composer

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    const effectBloom = new THREE.BloomPass(1.75);
    const effectShift = new THREE.ShaderPass(THREE.RGBShiftShader);

    effectShift.uniforms['amount'].value = 0.001;
    effectShift.renderToScreen = true;

    composer.addPass(effectBloom);
    composer.addPass(effectShift);

    // Events

    window.addEventListener('resize', onWindowResize, false);

    // DOM

    el.appendChild(renderer.domElement);
  }

  // -------------------------------------
  //   Lat + Long to Vector
  // -------------------------------------

  function latLongToVector3(lat, lon, r) {
    // http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs

    const phi = lat * Math.PI / 180;
    const theta = (lon - 180) * Math.PI / 180;

    const x = -r * Math.cos(phi) * Math.cos(theta);
    const y = r * Math.sin(phi);
    const z = r * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  }

  // -------------------------------------
  //   Interactivity
  // -------------------------------------

  function onWindowResize( event ) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // -------------------------------------
  //   Animate
  // -------------------------------------

  function animate(time) {
    render();
    TWEEN.update(time);
    requestAnimationFrame(animate);
  }

  // -------------------------------------
  //   Render
  // -------------------------------------

  function render() {
    if (el.style.cursor != 'move') target.x += 0.00075;

    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    camera.lookAt(center);
    renderer.render(scene, camera);
    composer.render();
  }

  // -------------------------------------
  //   Point
  // -------------------------------------

  function point(lat, lng, r, i) {
    const position = latLongToVector3(lat, lng, radius);

    const pointGeometry = new THREE.SphereGeometry(r, 32, 32);
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: '#769386',
      opacity: 0.6,
      side: THREE.DoubleSide,
      transparent: true
    });

    let point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(position.x, position.y, position.z);
    point.scale.set(0.01, 0.01, 0.01);
    point.lookAt(center);
    scene.add(point);

    new TWEEN.Tween(point.scale)
      .to({x: 1, y: 1, z: 1}, 1000)
      .delay(i * 350 + 1500)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    const pointRingGeometry = new THREE.RingGeometry(r + 0.5, r + 1.5, 32);
    const pointRingMaterial = new THREE.MeshBasicMaterial({
      color: '#769386',
      opacity: 0.2,
      side: THREE.DoubleSide,
      transparent: true
    });

    let pointRing = new THREE.Mesh(pointRingGeometry, pointRingMaterial);
    pointRing.position.set(position.x, position.y, position.z);
    pointRing.scale.set(0.01, 0.01, 0.01);
    pointRing.lookAt(center);
    scene.add(pointRing);

    new TWEEN.Tween(pointRing.scale)
      .to({x: 1, y: 1, z: 1}, 1500)
      .delay(i * 350 + 1500)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    return point;
  }

  // http://armsglobe.chromeexperiments.com/js/visualize_lines.js

  function drawCurve(a, b, i) {
    const distance = a.clone().sub(b).length();

    let mid = a.clone().lerp(b, 0.5);
    const midLength = mid.length();
    mid.normalize();
    mid.multiplyScalar(midLength + distance * 0.25);     

    let normal = (new THREE.Vector3()).subVectors(a, b);
    normal.normalize();

    const midStart = mid.clone().add(normal.clone().multiplyScalar(distance * 0.25));
    const midEnd = mid.clone().add(normal.clone().multiplyScalar(distance * -0.25));

    let splineCurveA = new THREE.CubicBezierCurve3(a, a, midStart, mid);
    let splineCurveB = new THREE.CubicBezierCurve3(mid, midEnd, b, b);

    let points = splineCurveA.getPoints(100);
    points = points.splice(0, points.length - 1);
    points = points.concat(splineCurveB.getPoints(100));
    points.push(center);

    let lineGeometry = new THREE.BufferGeometry();
    let positions = new Float32Array(points.length * 3);
    for (let ii = 0; ii < points.length; ii++) {
      positions[ii * 3 + 0] = points[ii].x;
      positions[ii * 3 + 1] = points[ii].y;
      positions[ii * 3 + 2] = points[ii].z;
    }
    lineGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineGeometry.setDrawRange(0, 0);

    var lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xffffff),
      linewidth: 3,
      opacity: 0.25,
      transparent: true
    });

    let line = new THREE.Line(lineGeometry, lineMaterial);
    line.currentPoint = 0;

    scene.add(line);
    return line;
  }

  // -------------------------------------
  //   Start
  // -------------------------------------

  init();
  animate();

  this.animate = animate;
  return this;
};
