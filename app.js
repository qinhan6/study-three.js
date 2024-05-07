import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 1. 引入性能监视器
import Stats from 'three/examples/jsm/libs/stats.module.js';

let scene, camera, renderer;
let controls;

// 立方体
let cube;

// 性能监视器
let stats;

// 1. 新建分组
let group = new THREE.Group();

function init () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight );
  document.body.append( renderer.domElement );
}

function createCube() {
  const cubeInfoArr = [];
  // 循环创建 5 个立方体
  for (let i = 0; i < 2500; i++) {
    cubeInfoArr.push({
      color: 
        `rgb(${Math.floor(Math.random() * (255 - 0 + 1) + 0)}, ${Math.floor(Math.random() * (255 - 0 + 1) + 0)}, ${Math.floor(Math.random() * (255 - 0 + 1) + 0)})`,
        w: Math.floor(Math.random() * (3 - 1 + 1) + 1),
        h: Math.floor(Math.random() * (3 - 1 + 1) + 1),
        d: Math.floor(Math.random() * (3 - 1 + 1) + 1),
        x: Math.floor(Math.random() * (5 - -5 + 1) + -5),
        y: Math.floor(Math.random() * (5 - -2 + 1) + -5),
        z: Math.floor(Math.random() * (5 - -5 + 1) + -5),
    })
  }

  // 创建立方体
  cubeInfoArr.map(cubeObj => {
    const { color, w, h, d, x, y, z } = cubeObj;
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshBasicMaterial({ color });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.name = 'cu' // 设置立方体的名称

    // 2. 将立方体添加到分组中
    group.add(cube);
  })
  // 3. 将分组添加到场景中
  scene.add(group);
}

function controlsCreate() {
  controls = new OrbitControls( camera, renderer.domElement);

  // 1. 阻尼效果
  controls.enableDamping = true;
  // controls.dampingFactor = 1;
  // 2. 自动旋转
  // controls.autoRotate = true;

  // 3. 垂直角度限制(0上面  Math.PI 下面)
  // controls.maxPolarAngle = Math.PI;
  // controls.minPolarAngle = 0;

  // // 水平角度范围控制
  // controls.maxAzimuthAngle = 1.5 * Math.PI
  // controls.minAzimuthAngle = 0.5 * Math.PI

  // // 4. 缩放范围
  // controls.minDistance = 2;
  // controls.maxDistance = 10;
}

function renderLoop() {
  renderer.render(scene, camera);
  
  controls.update();

  // 5.性能监视器不断更新
  // stats.update();
  // cube.rotation.x += 0.1;
  // 手动 JS 代码更新过摄像机的位置或者其他属性，需要调用 controls.update() 方法
  // 根据当前计算机浏览器刷新帧率（默认 60 次/秒），不断递归调用次函数渲染最新的画面状态
  // 好处：当前页面切换到后台就会停止渲染，节省资源
  requestAnimationFrame(renderLoop);
}

function createHelper () {
  // 1. 创建坐标轴对象
  const axesHelper = new THREE.AxesHelper(5);
  // 2. 添加到场景中
  scene.add( axesHelper );
}

function renderResize() {
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })
}

function createStats() {
  // 2. 创建性能监视器
  stats = new Stats();
  // 3. 设置监视器面板类型（0: fps - 每秒传输帧数， 1: ms - 每帧刷新用时， 2: mb - 内存占用）
  stats.showPanel(0);
  // 4. 设置监视器位置并添加到 DOM
  stats.domElement.style.position = 'fixed';
  stats.domElement.style.top = '10px';
  stats.domElement.style.left = '10px';
  document.body.appendChild(stats.dom);
}

function removeCube() {
  // 1. 给 window 绑定点击事件
  window.addEventListener('dblclick', () => {
    // // 2. 获取场景中所有的立方体
    // const arr = scene.children.filter(item => item.name === 'cu');
    // const cube = arr[0];
    // if (!cube) return;
    // cube.geometry.dispose(); // 释放几何体
    // cube.material.dispose(); // 释放材质

    // // 3. 从场景中移除立方体
    // scene.remove(cube);

    // 4. 移除分组中的立方体
    group.children.map(item => {
      item.geometry.dispose(); // 释放几何体
      item.material.dispose(); // 释放材质
      group.remove(item);
    })
    scene.remove(group);
  })

}

function createGeometry() {
  // 1. 创建几何体
  // 圆形情面：半径和三角面数量
  const circleFeo = new THREE.CircleGeometry( 5, 32 );
  // 平面几何体：宽高
  const planeGeo = new THREE.PlaneGeometry(1, 1);
  // 立方体几何体：半径 水瓶分三角形段数 垂直分三角形段数
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
  // 2. 创建材质   side: THREE.DoubleSide 双面显示
  const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
  // 3. 创建网格对象
  const circle = new THREE.Mesh( circleFeo, material );
  const plane = new THREE.Mesh( planeGeo, material );
  const sphere = new THREE.Mesh( sphereGeo, material );
  
  plane.position.set(2, 2, 2);
  sphere.position.set(-2, -2, -2);

  scene.add( circle );
  scene.add( plane );
  scene.add( sphere );
}

function createSphere() {
  // 1. 创建球体
  const geometry = new THREE.SphereGeometry(1, 32, 16);
  // 2. 创建材质 size: 点的大小
  const material = new THREE.PointsMaterial({ color: 0x6600ff, size: 0.05});
  // 3. 创建网格对象
  const sphere = new THREE.Points(geometry, material);
  scene.add(sphere);
}

function createLine() {
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const material = new THREE.LineBasicMaterial({ color: 0xc60fcc });
  
  const line = new THREE.Line( geometry, material );
  scene.add( line );
}

// 初始化
init()

// 轨道控制器
controlsCreate();

// 创建坐标轴
createHelper();

// 适配大小
renderResize();
 
// 创建立方体
// createCube();

// 绑定删除事件
// removeCube();

// 性能监视器
// createStats();

// 创建几何体
// createGeometry();

// 创建球体
// createSphere();

// 线条
createLine();

// 渲染循环
renderLoop();