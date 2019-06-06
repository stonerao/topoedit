import Base from './base'
var _this;
export default class Topo extends Base {
    /**
     * @webgl defalut:1   1=> webgl.1  2=>webgl.2   
     * @el String canvas 
     * @background any 画布颜色
     * @width Number 画布宽度
     * @height Number 画布高度
     * @controls Boolean 是否开启鼠标功能
     * @helper Boolean 是否启动辅助线
     * @cameraPosition Object 相机所在坐标
     * @deep number 延时
     */

    constructor(options) {
        super()
        /* created */
        _this = this;
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.controls = null;
        this.stats = null;
        this.raycaster = null;
        this.options = {
            width: null,
            height: null,
            click: null,
            data: [],//存储所有添加的节点
            links: [],
            meshLine: [],
            mouse: options.mouse
        }
        this.deep = options.deep || false;
        //是否渲染
        this.is_render = true
        /* 判断是否有canvas */
        this.canvas = document.querySelector(options.el)
        if (!this.isObject(this.canvas)) {
            //检查是否有canvas 
            return console.error("页面中没有canvas")
        }
        this.setOption(this.options, {
            width: options.width,
            height: options.height
        })
        this._init(options);
        //是否需要点击
        if (this.hasOwn(options, "click")) {
            if (typeof options['click'] === "function") {
                this.setOption(this.options, {
                    click: options.click

                })

                this.canvas.addEventListener("mouseup", this.click)
            }
        }
        this.canvas.addEventListener("mousemove", this.mousemove)
        window.addEventListener("resize", this.onWindowResize)
        var SELECT_IMG = new Image()
        SELECT_IMG.src = "/assets/image/select_city1.png"
        this.SELECT_IMG = SELECT_IMG;
        this.startImgs = {
            "2-1-1": "./assets/image/2-1-1.png",
            "2-1-2": "./assets/image/2-1-2.png",
            "2-1-3": "./assets/image/2-1-3.png",
            "2-2-1": "./assets/image/2-2-1.png",
            "2-2-2": "./assets/image/2-2-2.png",
            "2-2-3": "./assets/image/2-2-3.png",
            "2-2-4": "./assets/image/2-2-4.png",
            "2-2-5": "./assets/image/2-2-5.png",
            "2-3-1": "./assets/image/2-3-1.png",
            "2-3-2": "./assets/image/2-3-2.png",
            "2-3-3": "./assets/image/2-3-3.png",
            "2-3-5": "./assets/image/2-3-4.png",
            "2-3-4": "./assets/image/2-3-5.png",
            "2-4-1": "./assets/image/2-4-1.png",
            "2-4-2": "./assets/image/2-4-2.png",
            "2-4-3": "./assets/image/2-4-3.png",
        }

        for (var key in this.startImgs) {
            var img = new Image()
            img.src = this.startImgs[key]
            this.startImgs[key] = img
        }

        var routerName = new THREE.Texture(this.SELECT_IMG);
        routerName.needsUpdate = true;
        // var geometry = new THREE.CircleBufferGeometry(radius + 50, 32);
        var geometry = new THREE.PlaneGeometry(100, 100, 1);

        var material = new THREE.MeshBasicMaterial({
            // color: 0xffff00,
            side: THREE.DoubleSide,
            map: routerName
        });
        var circle = new THREE.Mesh(geometry, material);
        circle.rotation.x = Math.PI / 2
        circle.material.transparent = true;
        this.buildBox = circle

    }
    _init({
        welgl = 1,
        background = 0x04060E,
        controls = false,
        helper = false,
        cameraPosition = { x: 0, y: 1000, z: 0 },
        stats
    } = options) {
        /* created scene */
        let rendererOption = {
            canvas: this.canvas,
            antialias: true,
            alpha: true
        }
        let { width, height } = this.options;
        // if (welgl === 2) {
        //     /* 如果使用webgl2 */
        //     if (WEBGL.isWebGL2Available() == false) {
        //         document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
        //     } else {
        //         var context = this.canvas.getContext('webgl2');
        //         rendererOption.context = context;
        //     }
        // }
        this.renderer = new THREE.WebGLRenderer(rendererOption);
        //设置背景颜色 以及 大小
        this.renderer.setSize(width, height);
        this.renderer.setClearAlpha(0.5);
        // this.renderer.setClearColor(background, 1);
        //场景
        this.scene = new THREE.Scene()

        //透视相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 8000);
        //镜头位置 
        this.camera.position.set(...Object.values(cameraPosition))
        this.camera.rotation.set(-0.5386, 0.0008, 0.00048)
        //添加
        this.scene.add(this.camera)
        /*  setInterval(()=>{
             console.log(this.camera)
         },3000) */
        //是否开启鼠标功能
        if (controls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            this.controls.dampingFactor = 1;
            //是否可以缩放
            this.controls.enableZoom = true;
            //是否自动旋转controls.autoRotate = true; 设置相机距离原点的最远距离
            this.controls.minDistance = 0;
            //设置相机距离原点的最远距离
            this.controls.maxDistance = 3000;
            //是否开启右键拖拽
            this.controls.enablePan = true;
            this.controls.enableRotate = true;
            /* this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 1; */
        }
        if (helper) {
            /*   let help = new THREE.GridHelper(2200, 80)
              help.position.y=-5
              this.scene.add(help); */
        }
        if (stats) {
            this.stats = new Stats();
            this.stats.setMode(0);
            let stateNode = document.createElement('div');
            stateNode.innerHTML = '';
            stateNode.appendChild(this.stats.domElement)
            document.querySelector("body").appendChild(this.stats.domElement)
        }
        this.animationFrame();
        let resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
        //常用贴图  
        const getRandomFloat = (min, max) => (Math.random() * (max - min) + min);
        var dashArray = 0.1
        var dashOffset = 0
        var dashRatio = 0.1
        var linkMesh = {
            color: new THREE.Color("#91FFAA"),
            opacity: 1,
            resolution: resolution,
            sizeAttenuation: 1,
            lineWidth: 10,
            near: 10,
            far: 100000,

        }

        this.Material = {
            line: new THREE.LineBasicMaterial({
                color: 0x254968,
                linewidth: 1,
                linecap: 'round', //ignored by WebGLRenderer
                linejoin: 'round' //ignored by WebGLRenderer
            }),
            linne_mesh_1: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#91FFAA"),
                /*   dashArray,
                  // increment him to animate the dash
                  dashOffset,
                  // 0.5 -> balancing ; 0.1 -> more line : 0.9 -> more void
                  dashRatio: getRandomFloat(0.1, 0.4),
                  // side: DoubleSide,
                  transparent: true,
                  depthWrite: false, */
            }),
            linne_mesh_2: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#fea053"),
                /*   dashArray,
                  // increment him to animate the dash
                  dashOffset,
                  // 0.5 -> balancing ; 0.1 -> more line : 0.9 -> more void
                  dashRatio,
                  // side: DoubleSide,
                  transparent: true,
                  depthWrite: false, */
            }),
            linne_mesh_3: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#ff3d6c"),
            }),
            linne_mesh_4: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#e17cff"),
            }),
            linne_mesh_5: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#A0F0FF"),
            }),
            linne_mesh_6: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#009DFF"),
            }),
            linne_mesh_7: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#FFD030"),
            }),
            linne_mesh_8: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#FF7410"),
            })
            , linne_mesh_9: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#FF0053"),
                dashArray,
                // increment him to animate the dash
                dashOffset,
                // 0.5 -> balancing ; 0.1 -> more line : 0.9 -> more void
                dashRatio: getRandomFloat(0.1, 0.4),
                // side: DoubleSide,
                transparent: true,
                depthWrite: false,
                lineWidth: 12
            }),
        }
    }
    buildingAnimation(position, radius) {
        position[1] = 1
        //选择建筑的动效
        //建筑升起的特效

        let height = position[1].toString() * 2 + 100
        let number = 1;
        position[0] = position[0];
        let plane_arr = [];

        /*   let basePlane = this.buildBox.clone()
          basePlane.position.set(...position)
          basePlane.scale.x = 1.1
          basePlane.scale.y = 1.1
          basePlane.scale.z = 1.1
          this.scene.add(basePlane) */
        var initNode = (arr) => {
            if (number == 0) {
                // animation(basePlane)
                return
            }
            let plane = this.buildBox.clone()
            plane.position.set(...position)
            this.scene.add(plane)
            animation(plane)
            setTimeout(() => {
                number--;
                initNode()
            }, 600)
        }
        initNode(plane_arr)
        let _this = this
        function animation(node) {
            let num = 0;
            let scale_num = 0;
            let scale_time = setInterval(() => {
                let _n = 1 - scale_num * 0.02
                if (scale_num > 1) {
                    clearInterval(scale_time)
                    _TIME()
                }
                node.scale.x = _n
                node.scale.y = _n
                node.scale.z = _n
                scale_num++
            }, 40)
            const _TIME = () => {
                let time = setInterval(() => {
                    let _NUM = 1 - num / height
                    node.position.y = num;
                    node.material.opacity = _NUM;
                    num += 5
                    if (num >= height) {
                        clearInterval(time)
                        setTimeout(() => {
                            _this.dispose(node)
                        }, 100)
                    }
                }, 20)
            }

        }
    }
    loadImg({ width = 256, height = 256, img }, func) {
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        let _IMG = new Image();
        _IMG.src = img;
        _IMG.onload = () => {
            context.drawImage(_IMG, 0, 0, width, height);
            func(canvas)
        }
    }
    imgToCanvas({ width = 256, height = 256, img }) {
        //img 转换 canvas
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, width, height);
        return canvas
    }
    repeatLoadImg({ width = 64, height = 64, conut, img }, func) {
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width * conut;
        canvas.height = height * conut;
        let context = canvas.getContext("2d");
        let _IMG = new Image();
        _IMG.src = img;
        _IMG.onload = () => {
            var pat = context.createPattern(_IMG, "repeat");
            context.rect(0, 0, width * conut, height * conut);
            context.fillStyle = pat;
            context.fill();
            func(canvas)
        }
    }
    loadText({ width = 256, height = 128, text = "", color = "#ffba47" }) {
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);
        context.fill()
        context.closePath()
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#000000';
        context.lineWidth = 20;
        context.fillText(text, width / 2, height / 2);
        return canvas;
    }
    canvasItem({ width = 256, height = 256, img, x, y, z }) {
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        let _IMG = new Image();
        _IMG.src = img;
        _IMG.onload = () => {
            context.drawImage(_IMG, 0, 0, width, height);
            let routerName = new THREE.Texture(canvas);
            routerName.needsUpdate = true;
            let sprMat = new THREE.SpriteMaterial({ map: routerName });
            let spriteText = new THREE.Sprite(sprMat);
            spriteText._tpye = "team"
            spriteText.scale.set(100, 100, 1);
            spriteText.position.set(x, y, z)
            this.scene.add(spriteText);
        }

    }
    dispose(mesh, state) {
        /* 删除模型 */
        if (!state) {
            mesh.traverse(function (item) {
                if (item instanceof THREE.Mesh) {
                    item.geometry.dispose(); //删除几何体

                    if (item.material) {
                        item.material.dispose(); //删除材质
                    }
                }
            });
        } else {

        }
        this.scene.remove(mesh)
    }
    mousemove(event) {
        var raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2();
        let x, y;
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;

        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, _this.camera);
        let intersects = raycaster.intersectObjects([_this.scene], true);
        if (intersects.length > 0) {
            _this.options.mouse(intersects, event)
            /*  switch (event.button) {
                 case 0:
                     //左键  
                     break;
                 case 2:
                      //右键
                     break;
             } */
        }
    }
    click(event) {
        var raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2();
        let x, y;
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;

        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, _this.camera);
        let intersects = raycaster.intersectObjects([_this.scene], true);
        if (intersects.length > 0) {
            _this.options.click(intersects, event)
            /*  switch (event.button) {
                 case 0:
                     //左键  
                     break;
                 case 2:
                     //右键
                     break;
             } */
        }
    }
    strToNumbern(num) {
        return parseFloat(num)
    }
    deleteMeshLine() {

        this.options.meshLine.forEach(line => {
            this.dispose(line)
        })
        this.options.meshLine = []
    }
    addLineShowStep(img_code, position) {
        //连线展示开始图标
        let canvas = document.createElement('canvas');
        let RECT_SIZE = 128; //大小
        canvas.width = RECT_SIZE;
        canvas.height = RECT_SIZE;
        let context = canvas.getContext("2d");
        context.drawImage(this.startImgs[img_code], 0, 0, RECT_SIZE, RECT_SIZE);

        let routerName = new THREE.Texture(canvas);
        routerName.needsUpdate = true;
        let sprMat = new THREE.SpriteMaterial({ map: routerName });
        let spriteText = new THREE.Sprite(sprMat);
        let sprScale = 80;
        spriteText.scale.set(sprScale, sprScale, 1);
        spriteText.position.set(position[0], position[1], position[2]);
        spriteText.params_type = "step"
        this.scene.add(spriteText);
        this.options.meshLine.push(spriteText)
        return spriteText
    }
    addLineBlack(arr, reference, func) {
        let colorIndex = reference.split("-")[1];
        // colorIndex = Math.random() < 0.2 ? '4' : colorIndex
        let mesh_line
        switch (colorIndex) {
            case "1":
                mesh_line = this.Material.linne_mesh_1
                break
            case "2":
                mesh_line = this.Material.linne_mesh_2
                break
            case "3":
                mesh_line = this.Material.linne_mesh_3
                break
            default:
                mesh_line = this.Material.linne_mesh_4
        }
        var line = new MeshLine();
        var geometry = new THREE.Geometry();
        let lineNum = arr.length * 200;
        for (let i = 0; i < lineNum; i++) {
            geometry.vertices.push(new THREE.Vector3(arr[0].x, arr[0].y, arr[0].z));
        }
        line.setGeometry(geometry);
        var mesh = new THREE.Mesh(line.geometry, mesh_line);
        mesh.frustumCulled = false;
        mesh.params_type = "step";
        this.scene.add(mesh)
        this.options.meshLine.push(mesh)
        let stepTurt = this.addLineShowStep(reference, [arr[0].x, arr[0].y, arr[0].z])
        let addLine = (arr) => {
            if (!this.Vue.is_next) {
                return
            }
            if (arr.length == 1) {
                setTimeout(() => {
                    this.deleteMeshLine();
                    typeof func == 'function' ? func() : null;
                }, 1000)
                return
            }
            let obj = arr.shift();
            let src = {
                x: parseInt(obj.x),
                y: parseInt(obj.y),
                z: parseInt(obj.z) + 1
            }
            let dst = {
                x: parseInt(arr[0].x),
                y: parseInt(arr[0].y),
                z: parseInt(arr[0].z) + 1
            }
            this.animated(src, dst, 300, () => {
                line.advance(new THREE.Vector3(src.x, src.y, src.z))
                stepTurt.position.set(src.x, src.y, src.z)
            }, () => {
                addLine(arr)
            })

        }
        addLine(arr)
    }
    addLine(src, dst, type, end, index) {
        if (!src || !dst) {
            return
        }
        let p = (n) => {
            return parseFloat(n)
        }
        let _src = {
            x: p(src[0]),
            y: p(src[1]),
            z: p(src[2])
        }
        let _dst = {
            x: p(dst[0]),
            y: p(dst[1]),
            z: p(dst[2])
        }

        //线条颜色
        // let colorIndex = reference.split("-")[1];
        // colorIndex = Math.random() < 0.2 ? '4' : colorIndex
        let mesh_line
        switch (type) {
            case "1":
                mesh_line = this.Material.linne_mesh_5
                break
            case "2":
                mesh_line = this.Material.linne_mesh_6
                break
            case "3":
                mesh_line = this.Material.linne_mesh_7
                break
            case "4":
                mesh_line = this.Material.linne_mesh_8
            default:
                mesh_line = this.Material.linne_mesh_9

        }

        let _center = [
            (_src.x + _dst.x) / 2,
            (_src.y + _dst.y) / 2,
            (_src.z + _dst.z) / 2
        ]

        let cinum = 30;
        let _yheight = index % 30 * 10;
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(_src.x, _src.y, _src.z),
            new THREE.Vector3(_center[0], 200 + _yheight, _center[2]),
            new THREE.Vector3(_dst.x, _dst.y, _dst.z),
        ]);
        let vector = curve.getPoints(cinum);
        var geometry = new THREE.Geometry();
        for (let i = 0; i < cinum; i++) {
            geometry.vertices.push(new THREE.Vector3(...src));
        }
        var line = new MeshLine();
        if (type == 5) {
            line.setGeometry(geometry);
        } else {
            line.setGeometry(geometry, function (p) { return p });
        }

        /*    if (Math.random() > 0.75) {
           } else if (Math.random() > 0.55) {
               line.setGeometry(geometry, function (p) { return 1 - p }); // makes width sinusoidal
           } else if (Math.random() > 0.3) {
               line.setGeometry(geometry, function (p) { return 2 + Math.cos(40 * p); }); // makes width sinusoidal
           } else {
               line.setGeometry(geometry)
           }
    */

        var mesh = new THREE.Mesh(line.geometry, mesh_line);
        mesh.frustumCulled = false;
        mesh.params_type = "step"
        this.scene.add(mesh);

        let n = 0;

        //线条动画
        var interval = (n) => {
            if (n >= cinum) {
                this.buildingAnimation(dst, 50)
                let timeNumber = type == 5 ? 1500 / cinum : 10
                let t = setInterval(() => {
                    n--;
                    if (n < 0) {
                        typeof end == "function" ? end() : ""
                        deleteMesh()
                        clearInterval(t)
                    } else {
                        line.advance(vector[cinum - 1])
                    }
                }, timeNumber)
                return
            } else {
                n++
                setTimeout(() => {
                    line.advance(vector[parseInt(n)])
                    interval(n)
                }, 1500 / cinum);
            }
        }
        interval(n)
        var deleteMesh = () => {
            this.dispose(mesh)
            vector = null;
            cinum = null;
            curve = null;
            geometry = null;
            line = null;
            _center = null;
            mesh_line = null;
            mesh = null;
            n = null;
        }
        /* let p1 = { i: 0 }
        let p2 = { i: 300 }
        console.log(vector[0])
        this.animated(p1, p2, 3000, () => { 
            line.advance(vector[parseInt(p1.i)])
        }, () => {
            // this.addStep(_center, index, reference) 
            setTimeout(()=>{
                vector = null;
                cinum = null;
                curve = null;
                geometry = null;
                line = null;
                _center = null;
                mesh_line = null;
                this.dispose(mesh)
                mesh = null;
                n = null;
                console.timeEnd()
            },2000)
        }) */
    }
    set_rennder(state = true) {
        this.is_render = state;
        if (!this.is_render) {
            this.deep = 60000
        }
    }
    animationFrame() {
        if (_this.is_render) {
            _this.renderer.render(_this.scene, _this.camera);
        }
        if (_this.stats) {
            _this.stats.update()
        } 
        if (typeof _this.deep == 'number') {
            setTimeout(() => {
                requestAnimationFrame(_this.animationFrame);
            }, _this.deep);
        } else {
            requestAnimationFrame(_this.animationFrame);
        }
    }
    onWindowResize() {
        /*  if (typeof width !== 'number' && typeof height !== 'number') {
             return console.warn("width or height not is number")
         } */
        _this.camera.aspect = window.innerWidth / (window.innerHeight - 3);
        _this.camera.updateProjectionMatrix();
        _this.renderer.setSize(window.innerWidth, (window.innerHeight - 3));
    }
    animated(source, target, time, func, endFunc) {
        /**
         * @source 起始数据
         * @target 结束数据
         * @time 持续时间
         * @fun 持续中的事件
         * @endFunc 完成触发的事件
         */
        createjs.Tween.get(source).to(target, time)
            .call(handleChange)
        var Time = setInterval(() => {
            typeof func == 'function' ? func() : null;
        })

        function handleChange(event) {
            //完成 
            clearInterval(Time);
            typeof endFunc == 'function' ? endFunc() : null;
        }
    }
}

