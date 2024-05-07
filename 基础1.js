import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';

let scene, camera, renderer;
let controls;

// 立方体
let cube;

function init () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight );
  document.body.append( renderer.domElement );
}

function createCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
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

function moveCube() {
  // 1. 位移 position 属性
  // cube.position 值是一个 Vector3 对象，表示立方体的位置
  cube.position.x = 5
  // cube.position.set(1, 1, 1)

  // 2. 旋转 rotation 属性
  // cube.rotation 值是一个 Euler 对象，表示立方体的旋转角度
  cube.rotation.x = Math.PI / 4
  // cube.rotation.set(Math.PI / 4, 0, 0)

  // 3. 缩放 scale 属性
  cube.scale.set(2, 2, 2)
}

function createGUI() {
  const gui = new dat.GUI();
  // gui.add() 添加图形用户界面工具
  // 参数1: 关联DOM对象， JS对象
  // 参数2: 对象其中的某个属性，给这个属性关联用户界面工具（从而快速调整它的值）；
  gui.add(document, 'title')
  // 控制立方体显示/隐藏
  gui.add(cube, 'visible')
  // 控制轨道控制器初始化
  gui.add(controls, 'reset')
  // 控制立方体的颜色
  const colorObj = {
    'color': `#${cube.material.color.getHexString()}`
  }
  gui.addColor(colorObj, 'color').onChange((value) => {
    // cube.material.color.set(value)
    cube.material.color = new THREE.Color(value)
  })

  // 创建分组 - 影响立方体的位置
  const folder = gui.addFolder('位置');
  folder.add(cube.position, 'x', 0, 5, 0.1);
  folder.add(cube.position, 'y', 0, 5, 0.1);
  folder.add(cube.position, 'z', 0, 5, 0.1);

  // 下拉菜单(关键：第三个参数是一个对象，对象中的属性值是一个函数)
  // 对象中属性名-》下拉菜单选项的值
  gui.add({ type: '1' }, 'type', { '方案1': '1', '方案2': '2', '方案3': '3' }).onChange((value) => {
    switch (value) {
      case '1':
        cube.position.set(0, 0, 0);
        break;
      case '2':
        cube.position.set(1, 2, 2);
        break;
      case '3':
        cube.position.set(1, 1, 1);
        break;
    }
  })
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
createCube();

// moveCube()

// GUI工具
// createGUI();

// 渲染循环
renderLoop();