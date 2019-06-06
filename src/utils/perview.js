import base from './base'

/**
 *
 *
 * @export
 * @class Topo
 * @extends {base}
 */
export default class Topo extends base {
    constructor(options = {}) {
        super();
        this.init(options).then(() => {
            this.animationFrame()
        })
    }
    init = async (options) => {
        /*  */
        let { el, file } = options;
        const camera = [-10, 10, -18]
        let canvas = document.querySelector(el)
        let [width, height] = [400, 300]
        canvas.width = width;
        canvas.height = height;
        let rendererParameter = {
            canvas: canvas,
            antialias: true,
            alpha: true
        }
        this.renderer = new THREE.WebGLRenderer(rendererParameter);
        this.renderer.setSize(width, height);
        // this.renderer.setClearAlpha(0.5);
        this.renderer.setClearColor(0x000000, 1);
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this.camera.position.set(...camera)
        this.scene.add(this.camera)

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        this.controls.dampingFactor = 1;
        //是否可以缩放
        this.controls.enableZoom = true;
        //是否自动旋转controls.autoRotate = true; 设置相机距离原点的最远距离
        this.controls.minDistance = 0;
        //设置相机距离原点的最远距离
        this.controls.maxDistance = 1000;
        //是否开启右键拖拽
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
        /* this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1; */

        /*    var size = 10;
           var divisions = 10;
           var gridHelper = new THREE.GridHelper(size, divisions);
           this.scene.add(gridHelper); */


        var light = new THREE.AmbientLight(0xffffff); // soft white light
        this.scene.add(light);
        var light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(...camera);
        this.scene.add(light);

        /*  var geometry = new THREE.BoxGeometry(10, 10, 10);
         var material = new THREE.MeshPhongMaterial({ color: 0xcfcfcf });
         var cube = new THREE.Mesh(geometry, material); 
         this.scene.add(cube) */

      /*   var objLoader = new THREE.OBJLoader();
        console.log(file)
        objLoader.load(file, function (mesh) {
            console.log(mesh)
        });
 */

        return true
    }
    animationFrame = () => {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animationFrame);
    }
    dispose(mesh) {
        /* 删除模型 */
        mesh.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
                item.geometry.dispose(); //删除几何体 
                if (item.material) {
                    item.material.dispose(); //删除材质
                }
            }
        });
        this.scene.remove(mesh)
    }


}