/**
 * SIVSA hero.js — Three.js scene
 * Concepto: Road Perspective View
 * Capa Técnica: blueprint grid overlay
 * Reflejo: retroreflective particles, scan beam, mouse parallax
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(function initHero() {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // ─── Config ────────────────────────────────────────────────────────────
  const C = {
    fogColor:       0x070A0F,
    fogDensity:     0.028,
    roadColor:      0x090C14,
    dashColor:      0xF5C518,  // amber
    edgeColor:      0xD8DFF0,  // cool white
    gridColor:      0x3D8EF0,  // blueprint blue
    scanColor:      0xF5C518,
    particleColor:  0xFFFFFF,

    dashCount:   24,
    dashSpacing: 4.5,
    dashSpeed:   0.068,

    particleCount: 900,
    scanSpeed:     0.042,

    idleAmplitude: 0.14,
    idleSpeed:     0.10,
    mouseInfluence:0.48,
    mouseDamp:     0.032,
  };

  // ─── Renderer setup ────────────────────────────────────────────────────
  const hero = canvas.parentElement;
  let W = hero.offsetWidth;
  let H = hero.offsetHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(C.fogColor);

  // ─── Scene ─────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(C.fogColor, C.fogDensity);

  // Camera: slightly elevated, looking down the road in -Z
  // Objects at z < 5.5 are in front of camera
  const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 200);
  camera.position.set(0, 1.8, 5.5);
  camera.lookAt(0, 0, -20);

  // ─── Road plane ────────────────────────────────────────────────────────
  // 20 wide × 120 deep, centered at z=-50 → extends from z=+10 (behind camera)
  // to z=-110 (into the fog). Visible section: z=5.4 → z=-110.
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 120),
    new THREE.MeshBasicMaterial({ color: C.roadColor })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0, -50);
  scene.add(road);

  // ─── Blueprint grid (Capa Técnica) ─────────────────────────────────────
  (function buildGrid() {
    const pts = [];
    const W = 9, step = 3;
    // Longitudinal (along road)
    for (let x = -W; x <= W; x += step) {
      pts.push(new THREE.Vector3(x, 0.004, 5));
      pts.push(new THREE.Vector3(x, 0.004, -110));
    }
    // Transversal (across road)
    for (let z = 5; z >= -110; z -= step) {
      pts.push(new THREE.Vector3(-W, 0.004, z));
      pts.push(new THREE.Vector3(W, 0.004, z));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: C.gridColor, transparent: true, opacity: 0.038,
    });
    scene.add(new THREE.LineSegments(geo, mat));
  })();

  // ─── Edge lines (white shoulder markings) ──────────────────────────────
  function makeEdge(x) {
    const pts = [
      new THREE.Vector3(x, 0.013, 5),
      new THREE.Vector3(x, 0.013, -115),
    ];
    const mat = new THREE.LineBasicMaterial({
      color: C.edgeColor, transparent: true, opacity: 0.48,
    });
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
  }
  scene.add(makeEdge(-4.2));
  scene.add(makeEdge(4.2));

  // ─── Center dashes (amber, animated toward camera) ─────────────────────
  // All start in front of camera (z < 5.5).
  // Initial positions: z = 5, 0.5, -4, -8.5, -13 ... (5 - i*4.5)
  const dashGeo = new THREE.BoxGeometry(0.14, 0.008, 1.6);
  const dashMat = new THREE.MeshBasicMaterial({ color: C.dashColor });
  const dashes = [];

  for (let i = 0; i < C.dashCount; i++) {
    const m = new THREE.Mesh(dashGeo, dashMat);
    m.position.set(0, 0.016, 5 - i * C.dashSpacing);
    scene.add(m);
    dashes.push(m);
  }

  // ─── Retroreflective particles (Reflejo) ───────────────────────────────
  const pPos = new Float32Array(C.particleCount * 3);
  for (let i = 0; i < C.particleCount; i++) {
    const x = (Math.random() - 0.5) * 9;
    const z = -Math.random() * 100 + 4;    // z from 4 to -96
    const onCenter = Math.abs(x) < 0.28;
    const onEdge   = Math.abs(Math.abs(x) - 4.2) < 0.28;
    pPos[i * 3]     = x;
    pPos[i * 3 + 1] = (onCenter || onEdge) ? Math.random() * 0.09 : Math.random() * 0.02;
    pPos[i * 3 + 2] = z;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: C.particleColor, size: 0.036,
    transparent: true, opacity: 0.58, sizeAttenuation: true,
  });
  scene.add(new THREE.Points(pGeo, pMat));

  // ─── Scan beam (amber, slow sweep) ─────────────────────────────────────
  const scanMesh = new THREE.Mesh(
    new THREE.BoxGeometry(9, 0.005, 0.38),
    new THREE.MeshBasicMaterial({ color: C.scanColor, transparent: true, opacity: 0.14 })
  );
  scanMesh.position.set(0, 0.018, 4);
  scene.add(scanMesh);

  // ─── Mouse parallax ────────────────────────────────────────────────────
  let mx = 0, my = 0;
  let camOffX = 0, camOffY = 0;

  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ─── Animate ───────────────────────────────────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t = 0;

  function animate() {
    if (!prefersReduced) requestAnimationFrame(animate);
    t += 0.008;

    // Move dashes toward camera (+Z). Reset when past camera.
    for (let i = 0; i < dashes.length; i++) {
      dashes[i].position.z += C.dashSpeed;
      if (dashes[i].position.z > 5) {
        dashes[i].position.z -= C.dashCount * C.dashSpacing;
      }
    }

    // Scan beam moves same direction, slower; fades near camera
    scanMesh.position.z += C.scanSpeed;
    if (scanMesh.position.z > 5) scanMesh.position.z -= 104;
    const scanFade = Math.max(0, 1 - Math.abs(scanMesh.position.z - 2) * 0.014);
    scanMesh.material.opacity = 0.14 * scanFade * (0.7 + Math.sin(t * 4.5) * 0.3);

    // Retroreflective twinkle
    pMat.opacity = 0.4 + Math.sin(t * 3.6) * 0.18 + Math.cos(t * 7.9) * 0.07;

    // Camera: idle drift + mouse parallax
    camOffX += (mx * C.mouseInfluence - camOffX) * C.mouseDamp;
    camOffY += (my * 0.16 - camOffY) * C.mouseDamp;

    camera.position.x = camOffX + Math.sin(t * C.idleSpeed) * C.idleAmplitude;
    camera.position.y = 1.8 - camOffY * 0.2;
    camera.lookAt(
      camOffX * 0.22 + Math.sin(t * C.idleSpeed) * 0.04,
      -0.12,
      -22
    );

    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);  // First frame
  if (!prefersReduced) animate();

  // ─── Resize ────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }, { passive: true });

})();
