import base from './base'

/**
 *
 *
 * @export
 * @class Topo
 * @extends {base}
 */
const typesId = [
    {
        type: 1,
        img: 'analysis.png',
        name: '分析系统'
    },

    {
        type: 2,
        img: 'server.png',
        name: '应用服务器1'
    },
    {
        type: 3,
        img: 'server.png',
        name: '应用服务器2'
    },

    {
        type: 4,
        img: 'manage.png',
        name: '管理系统'
    },
    {
        type: 5,
        img: 'inter_control.png',
        name: '互联网控制系统'
    },
    {
        type: 6,
        img: 'huiju.png',
        name: '汇聚系统'
    },
    {
        type: 7,
        img: 'jiaohuan.png',
        name: '交换机'
    },
    {
        type: 8,
        img: 'renzheng.png',
        name: '认证系统'
    },

    {
        type: 9,
        img: 'wangguan.png',
        name: '异构网间安全互联网关'
    },
    {
        type: 10,
        img: 'wangguan.png',
        name: '地面网间安全互联网关'
    },
    {
        type: 11,
        img: 'wangguan.png',
        name: '天基骨干卫星安全接入网关'
    },
    {
        type: 12,
        img: 'wangguan.png',
        name: '宽带卫星安全接入网关'
    },

    {
        type: 13,
        img: 'internet.png',
        name: 'internet'
    },
    {
        type: 14,
        img: 'internet.png',
        name: '移动互联网'
    },

    {
        type: 15,
        img: 'wifi.png',
        name: '无线访问点'
    },


    {
        type: 16,
        img: 'zhongduan.png',
        name: '终端1'
    },
    {
        type: 17,
        img: 'zhongduan.png',
        name: '终端2'
    },
    {
        type: 18,
        img: 'zhongduan.png',
        name: '终端3'
    },
    {
        type: 19,
        img: 'zhongduan.png',
        name: '终端4'
    },

    {
        type: 20,
        img: 'fire.png',
        name: '防火墙1'
    },
    {
        type: 21,
        img: 'fire.png',
        name: '防火墙2'
    },
].map(m => m.type)
export default class Topo extends base {
    constructor(options = {}) {
        super();
        /**
         * @extends {options}
         * @webgl :Number 1=>webgl 1  2=>webgl 2
         * @el :String *canvas
         * @background :String canvas background color
         * @width :Number canvas width
         * @height :Number canvas height
         * @controls :Boolean is controls
         * @camera :Object {x,y,z} camera position 
         * @click :Function canvas click event  
         * @helper :Boolean canvas helper
         */
        let { watch, lineWach, click } = options;
        options = {
            width: 1590,
            height: 969,
            webgl: 1,
            camera: { x: 0, y: 2200, z: 600 },
            controls: true,
            el: "#canvas",
            stats: true,
            helper: true,
            watch: watch,
            lineWach: lineWach,
            click: click
        }
        this.state = {
            ...options,
            canvas: document.querySelector(options.el),
            isDrag: false,
            dragMesh: null,
            meshs: [],
            lines: [],
            all_lines: [],
            currentMesh: {
                name: "",
                id: "",
                type: ""
            }
        }
        this.basic = {
            lineColor: 0xffffff,
            thingLine: new THREE.LineBasicMaterial({
                color: 0xff0000
            }),
            lineBasic: new THREE.LineBasicMaterial({
                color: 0xffffff
            })
        }

        this.init().then((res) => {
            if (res) {
                this.animationFrame()
                document.querySelector(options.el).addEventListener("mousemove", this.mouseover)
                document.querySelector(options.el).addEventListener("mouseup", this.mouseUp)
            }
        })
    }
    getCanvasHeight = () => {
        let dom = document.querySelector(this.state.el);
        let parent = dom.parentNode;
        return {
            height: parent.clientHeight,
            width: parent.clientWidth
        }
    }

    init = async () => {
        /*  */
        let { welgl, camera, controls, helper, canvas, stats } = this.state;
        let { width, height } = this.getCanvasHeight()
        this.state.width = width;
        this.state.height = height;
        canvas.width = width;
        canvas.height = height;
        let rendererParameter = {
            canvas: canvas,
            antialias: true,
            alpha: true
        }
        if (welgl === 2) {
            if (WEBGL.isWebGL2Available() == false) {
                document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
            } else {
                var context = this.canvas.getContext('webgl2');
                rendererParameter.context = context;
            }
        }
        this.renderer = new THREE.WebGLRenderer(rendererParameter);
        this.renderer.setSize(width, height);
        this.renderer.setClearAlpha(0.5);

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 9000);
        this.camera.position.set(...Object.values(camera))
        this.scene.add(this.camera)
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
            var size = 3000;
            var divisions = 200;
            var gridHelper = new THREE.GridHelper(size, divisions);
            gridHelper.position.y = -2;
            this.scene.add(gridHelper);
            //add foot
            var geometry = new THREE.PlaneGeometry(size, size, 32);
            var material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
            var plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = Math.PI / 2
            plane.position.y = -11;
            plane.MeshType = "floor"
            this.scene.add(plane);
        }



        if (stats) {
            this.stats = new Stats();
            this.stats.setMode(0);
            let stateNode = document.createElement('div');
            stateNode.innerHTML = '';
            stateNode.appendChild(this.stats.domElement)
            document.querySelector("body").appendChild(this.stats.domElement)
        }
        return true
    }
    animationFrame = () => {
        this.stats.update()
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animationFrame);
    }
    initDrag = (options) => {
        const { type, id, name } = options;
        this.state.currentMesh = options;
        let meshs = this.state.dragMesh;
        this.state.isDrag = true;
        const t = 1
        if (typeof meshs === "object" && meshs) {
            meshs.visible = true
        } else {
            switch (t) {
                case 1:
                    var geometry = new THREE.BoxGeometry(20, 20, 20);
                    var material = new THREE.MeshBasicMaterial({
                        color: 0xccccff,
                        transparent: true,
                        // wireframe :true
                    });
                    var cube = new THREE.Mesh(geometry, material);
                    cube.position.y = 0;
                    cube.material.opacity = 0.8;
                    //表示透明度小于0.4时，不显示 
                    cube.material.needsUpdate = true;
                    this.state.dragMesh = cube;
                    this.scene.add(cube);
                    break
            }
        }



    }
    clearDrag() {
        this.state.isDrag = false;
        this.state.dragMesh.visible = false;
    }
    mouse = async (event) => {
        var raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2();
        let x, y;
        if (event.changedTouches) {
            x = event.changedTouches[0].offsetX;
            y = event.changedTouches[0].offsetY;

        } else {
            x = event.offsetX;
            y = event.offsetY;
        }
        mouse.x = (x / this.state.width) * 2 - 1;
        mouse.y = -(y / this.state.height) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);
        let intersects = raycaster.intersectObjects([this.scene], true);
        return intersects
    }
    mouseUp = (event) => {
        //canvas mouseup 
        if (event.button === 0) {
            // left mouse button
            this.mouse(event).then(intersects => {
                if (this.state.isDrag) {
                    // mouse added button 
                    this.addMesh(this.state.dragMesh.position, this.state.currentMesh);
                    this.clearDrag()
                } else {
                    //click to get the model
                    this.state.click(intersects)
                }
            })
        }
    }
    mouseover = (event) => {
        this.mouse(event).then(intersects => {
            //get floor mesh 
            if (intersects.length > 0) {
                if (this.state.isDrag) {
                    let floor = intersects.filter(elem => elem.object.MeshType === "floor")[0]
                    if (floor) {
                        // console.log(floor)
                        this.state.dragMesh.position.x = floor.point.x
                        this.state.dragMesh.position.z = floor.point.z
                    }
                }

            }
        })

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
    addBasicLine = ({ dst, src, lines }) => {
        // added basic line
        const { lineColor } = this.basic;
        let nodes = this.state.meshs;
        let srcNode, dstNode;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].options.id === src) {
                srcNode = {
                    ...nodes[i].position,
                    ...nodes[i].options
                }
            }
            if (nodes[i].options.id === dst) {
                dstNode = {
                    ...nodes[i].position,
                    ...nodes[i].options
                }
            }
        }
        if (!srcNode || !dstNode) {
            return console.error("node error")
        }
        // added node lines
        var material = this.basic.lineBasic
        var geometry = new THREE.Geometry();
        if (lines) {
            lines.forEach(l => {
                geometry.vertices.push(
                    new THREE.Vector3(l.x, l.y, l.z)
                );
            })

        } else {
            geometry.vertices.push(
                new THREE.Vector3(srcNode.x, srcNode.y, srcNode.z),
                new THREE.Vector3(dstNode.x, dstNode.y, dstNode.z),
            );
        }
        var line = new THREE.Line(geometry, material);
        this.scene.add(line);
        line.MeshType = "line"
        line.options = {
            src: srcNode,
            dst: dstNode
        }
        this.state.all_lines.push(line)
        let _lines = lines ? lines : [this.exportXYZ(srcNode), this.exportXYZ(dstNode)]
        this.state.lines.push({
            ...line.options,
            src: srcNode,
            dst: dstNode,
            lines: _lines,
            id: line.uuid
        })
        if (typeof this.state.lineWach === "function") {
            this.state.lineWach(this.state.lines)
        }
    }
    addMesh = (position, _mesh) => {
        let { type, img } = _mesh;
        let map = null;
        if (typesId.indexOf(type) !== -1) {
            map = THREE.ImageUtils.loadTexture(img)
        }

        let basic;
        if (map) {
            basic = {
                map: map
            }
        } else {
            basic = { color: 0x00ff00 }
        }
        var geometry = new THREE.BoxGeometry(20, map ? 2 : 20, 20);
        var material = new THREE.MeshBasicMaterial(basic);
        var cube = new THREE.Mesh(geometry, material);
        for (let key in position) {
            position[key] = parseInt(position[key])
        }
        cube.position.set(...Object.values(position))
        cube.position.y = map ? 0 : 10;
        this.scene.add(cube);
        // the mesh added options
        cube.MeshType = "model";
        cube.options = _mesh;
        this.state.meshs.push(cube)
        //if threr is connection 
        if (_mesh.src) {
            //added basic line
            this.addBasicLine({
                src: _mesh.src,
                dst: cube.options.id
            })
        }
        if (typeof this.state.watch === "function") {
            this.state.watch(this.state.meshs)
        }
    }
    async deleteMesh(item) {
        // delete node
        this.state.meshs = this.state.meshs.filter(node => item.uuid !== node.uuid)
        this.state.watch(this.state.meshs)
        this.dispose(item)
        // delete related line 
        this.state.all_lines = this.state.all_lines.filter(line => {
            if (line.options.src.id == item.options.id || line.options.dst.id == item.options.id) {
                this.dispose(line)
                return false
            } else {
                return true
            }

        })
        this.state.lines = this.state.lines.filter(line => {
            if (line.src.id == item.options.id || line.dst.id == item.options.id) {

                return false
            } else {
                return true
            }
        })
        this.state.lineWach(this.state.lines)
    }
    exportXYZ(obj) {
        return {
            x: obj.x,
            y: obj.y,
            z: obj.z
        }
    }
    selectLine() {
        //select line highlighting

    }
    thingLine(item) {
        this.state.all_lines.forEach(line => {
            // thingLine
            if (line.uuid == item.id) {
                line.material = this.basic.thingLine
            } else {
                line.material = this.basic.lineBasic
            }
        })
    }
    replacement(line) {
        // replacement line 
        let currentLine = this.state.all_lines.filter(l => l.uuid == line.id)[0];
        currentLine.geometry.dispose()
        var geometry = new THREE.Geometry();
        line.lines.forEach(n => {
            geometry.vertices.push(
                new THREE.Vector3(n.x, n.y, n.z),
            );
        })
        currentLine.geometry = geometry
    }
    clearMesh = () => {
        // 清楚所有节点
        let child = this.scene.children;
        let index = child.length - 1;
        while (index >= 0) {
            if (child[index].MeshType === "model" || child[index].MeshType === "line") {
                this.dispose(child[index])
            }
            index--;
        }
    }
    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / (window.innerHeight - 3);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, (window.innerHeight - 3));
    }
}