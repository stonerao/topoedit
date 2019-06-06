import Base from '../topoBase'
const MODEL_SRC = '/assets/model/'
const IMG_SRC = '/assets/image/'
let obj_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];;//有obj的类型
let img_type_plane = [11, 12]
export default class Topo extends Base {
    constructor(options) {
        super(options)
        let { VUE, typeMap } = options;
        this.Vue = VUE;
        this.typeMap = typeMap;
        /* var geometry = new THREE.BoxGeometry(100, 100, 100);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        cube.datas = {
            type: 1,
            name: 2
        }
        this.options.data.push(cube) */
        var light = new THREE.AmbientLight(0xffffff); // soft white light
        this.scene.add(light);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.scene.add(directionalLight);
        //平铺地板
        let conut = 120;
        let wsize = 64;
        /*  this.repeatLoadImg({
             width: wsize, height: wsize,
             conut: conut, img: IMG_SRC + "BG2.png"
         }, (canvas) => {
             let routerName = new THREE.Texture(canvas);
             routerName.needsUpdate = true;
             let geometry = new THREE.PlaneGeometry(2400, 2400, 6);
             let material = new THREE.MeshBasicMaterial({ alpha: true, antialias: true, map: routerName, side: THREE.DoubleSide });
             let plane = new THREE.Mesh(geometry, material);
          
             plane.datas = {
                 type: "footer",
             }
             plane.rotation.x = Math.PI / 2;
             plane.position.y = -2;
             // plane.position.set(x, y, z);
             this.scene.add(plane);
             this.options.data.push(plane);
         }) */

    }
    addUnitFoot(node) {
        //攻击
        
    }
    loadGraph(datas) {
        let all_obj = Object.assign({})
        let loadObj = this.typeMap.filter(t => obj_arr.includes(parseInt(t.type)))
        let count = 0;
        let { nodes, links } = datas;
        let scene = this.scene;
        let selectTeam = null;//选择的队伍
        /* 加载obj */
        let load = (data) => {
            //所有模型加载完毕
            //加载所有模型
            let n_index = 0;
            var group = new THREE.Group();
            while (n_index < nodes.length) {
                let node = nodes[n_index]
                if (obj_arr.includes(parseInt(node.type))) {
                    let mesh = data[`obj_${node.type}`].clone()
                    mesh.position.set(node.x, node.y, node.z)
                    group.add(mesh)
                    if(node.type==1&&node.z<0){
                        mesh.rotation.y = Math.PI
                    }
                }
                if (selectTeam==null&&node.type==9){
                    selectTeam=node
                }
                n_index++;
            }
            scene.add(group); 
            //选中 

           console.log(selectTeam)
            this.Vue.addNode({
                x: selectTeam.x,
                y: "0",
                z: 722,
                name: "队伍",
                type: "12",
                id: this.Vue.max_id++,
                info: "fenzu6.png,130,310,false,1",
            })
          
            
          
        }
        //获取节点中所有需要加载的obj与mtl; 
        loadObj.forEach((node, index) => {
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.load(MODEL_SRC + node.mtl, function (materials) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(MODEL_SRC + node.obj, function (mesh) {
                    count++
                    all_obj[`obj_${node.type}`] = mesh.children[0];
                    if (count == loadObj.length) {
                        load(all_obj)

                    }
                });
            });
        })
        //加载所有图片
        let type_img = nodes.filter(node => {
            if (img_type_plane.includes(parseInt(node.type))) {
                if (node.info) {
                    return true
                }
                return false
            }
            if (node.info) {
                return true
            }
            return false
        })
        let all_img = type_img.map(x => {
            if (x.type == "11") {
                return {
                    ...x,
                    img: null,
                    src: x.info
                }
            } else if (x.type == "12") {
                return {
                    ...x,
                    img: null,
                    src: x.info.split(",")[0]
                }
            }
        })
        let loadNumber = 0;
        var loadImg = (src, func) => {
            let img = new Image();
            img.src = src;
            img.onload = (e) => {
                func(img, true)
            }
            img.onerror = (e) => {
                func("", false)
            }
        }
        let cubeMaterial = null
        let addPlane = (node) => {

            /* var spriteMap = new THREE.TextureLoader().load('/assets/image/'+node.info);
            var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(90, 120, 1)
            sprite.position.set(node.x, node.y, node.z)
            return sprite */
            let canvas = null;
            let p_size = {
                width: 256,
                height: 256
            }
            if (node.type == 11) {
                canvas = this.imgToCanvas({
                    width: 256,
                    height: 256,
                    img: node.img
                })
                p_size = {
                    width: 367 / 5.5,
                    height: 496 / 5.5
                }
            } else if (node.type == 12) {
                let arr = node.info.split(",")
                let WIDTH = arr[1]
                let HEIGHT = arr[2]
                canvas = this.imgToCanvas({
                    width: WIDTH,
                    height: HEIGHT,
                    img: node.img
                })
                p_size = {
                    width: WIDTH,
                    height: HEIGHT
                }
                if (arr[3] != 'false') {
                    this.addTitle(node)
                }
            }
            let routerName = new THREE.Texture(canvas);
            routerName.needsUpdate = true;
            var geometry = new THREE.PlaneGeometry(p_size.width, p_size.height, 6);
            var material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });

            var plane = new THREE.Mesh(geometry, material);
            plane.datas = {
                type: node.type,
                name: node.name,
                id: node.id,
                info: node.info
            }
            if (node.type == 11) {
                if (node.z < 0) {
                    cubeMaterial = material;
                    plane.rotation.x = -Math.PI / 2 + Math.PI / 4;
                    plane.position.set(node.x, parseInt(node.y) + 48, node.z)
                } else {
                    plane.rotation.x = -Math.PI / 2 + 0.15;
                    plane.position.set(node.x, parseInt(node.y) + 7, node.z)

                }
            } else if (node.type == 12) {
                plane.rotation.x = -Math.PI / 2
                plane.position.set(node.x, node.y, node.z)

            }

            return plane
        }
        let all_img_end = () => {
            //所有图片加载完成 
            /* var group = new THREE.Group();
            var geometry = new THREE.Geometry() */
            all_img.forEach(node => {
                let plane = addPlane(node)
                //   plane.position.x = nodex.x
                // plane.position.y = nodex.y
                /*  plane.position.z = 123
                 plane.updateMatrix(); //手动更新模型的矩阵
 
                 geometry.merge(plane.geometry, plane.matrix); //将几何体合并 */
                // group.add(plane)
                scene.add(plane)
            })

            // scene.add(new THREE.Mesh(geometry))

        }
        all_img.forEach(x => {
            loadImg(IMG_SRC + x.src, (img, state) => {
                loadNumber++;
                if (state) {
                    x.img = img;
                } else {

                }
                if (loadNumber == all_img.length) {
                    //所有图片加载完成
                    all_img_end()
                }
            })
        })

        type_img.forEach(node => {
            if (node.info != "") {
                switch (parseInt(node.type)) {
                    case "11":
                        break;
                }
            }
        })
        //添加连线
        /* let LineBasicMaterial = this.Material.line;
        let addLink = (item)=>{
            let { src, dst } = item;
            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(src.x, src.y, src.z),
                new THREE.Vector3(dst.x, dst.y, dst.z)
            );
            var line = new THREE.Line(geometry, LineBasicMaterial);
            return line
        } */
        links.forEach(link => {
            /*  let line = addLink(link)
             line.updateMatrix(); //手动更新模型的矩阵
             geometry.merge(line.geometry, line.matrix); //将几何体合并 */
            this.addLink(link)
        })
        //测试连线 
        /* let num = 0
         let time = setInterval(() => { 
             if (num >= links.length - 1) {
                 num = 0
             }
             num++
             let l = links[num] 
             this.addLine([l.src.x, l.src.y, l.src.z], [l.dst.x, l.dst.y, -l.dst.z], `1-${num%4}-3`)
             
         },2000)  */
       /*  let num = 0
        let showLine = ()=>{
            if (num >= links.length-1){
                num=0
            }
            num++
            let l = links[num]
            this.addLine([l.src.x, l.src.y, l.src.z], [l.dst.x, l.dst.y, -l.dst.z], '1-3-3',function(){
                showLine() 
            })
        }
        showLine() */
        // scene.add(new THREE.Mesh(geometry, material));
    }
    addTitle(node) {
        //不需要字的地板 
        let info_arr = node.info.split(",")
        let [twidth, theight] = [200, 40]
        let color = info_arr[4] == '1' ? '#ffba47' : '#0094f8'
        let textImg = this.loadText({ width: twidth, height: theight, text: info_arr[3], color: color })
        let routerName = new THREE.Texture(textImg);
        routerName.needsUpdate = true;
        let geometry = new THREE.PlaneGeometry(twidth, theight, 6);
        let material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });
        let plane = new THREE.Mesh(geometry, material);
        plane.datas = {
            type: node.type,
            name: node.name,
            info: node.info
        }
        plane.rotation.z = Math.PI * 2;
        plane.rotation.x = -Math.PI / 8;
        let p = (n) => {
            return parseFloat(n)
        }
        plane.position.set(node.x, p(node.y) + theight / 2, p(node.z) + p(info_arr[2]) / 2 + 30);
        this.scene.add(plane);
    }
    addNodes({ type, name, x = 0, y = 0, z = 0, id, info }) {
        if (type === "" || name === "") {
            alert("类型或者名字不能为空")
            return
        }
        let rotation = [1]
        let type_id = parseInt(type);
        var mtlLoader = new THREE.MTLLoader();
        let scene = this.scene;
        let node = this.typeMap.filter(x => x.type == type)[0]
        const meshAdd = (mesh) => {
            let node = mesh.children[0]
            node.position.set(x, y, z)
            node.datas = {
                type: type,
                name: name,
                id: id
            }
            this.options.data.push(node)
            if (rotation.includes(type_id)) {
                //如果在z为负数  反方向
                if (z < 0) {
                    node.rotation.y = Math.PI
                }
            }
            scene.add(node)
        }



        if (obj_arr.includes(type_id)) {
            //有模型 
            if (this.hasOwn(node, "obj") && this.hasOwn(node, "mtl")) {
                mtlLoader.load(MODEL_SRC + node.mtl, function (materials) {
                    materials.preload();
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(MODEL_SRC + node.obj, function (mesh) {
                        meshAdd(mesh)
                    });
                });
            } else if (this.hasOwn(node, "obj") && !this.hasOwn(node, "mtl")) {
                var objLoader = new THREE.OBJLoader();
                objLoader.load(MODEL_SRC + node.obj, function (mesh) {
                    meshAdd(mesh)
                });
            }
        } else if (img_type_plane.includes(type_id)) {
            //加载地板系列
            /* let node = this.canvasItem({
                width: 1024,
                height: 1024,
                img: "/assets/image/" + info,
                x: x,
                y: y,
                z: z,
            }) */
            switch (type_id) {
                case 11:
                    // 队伍
                    this.loadImg({
                        width: 256,
                        height: 256,
                        img: IMG_SRC + info
                    }, (canvas) => {
                        let routerName = new THREE.Texture(canvas);
                        routerName.needsUpdate = true;
                        var geometry = new THREE.PlaneGeometry(367 / 5.5, 496 / 5.5, 6);
                        var material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });
                        var plane = new THREE.Mesh(geometry, material);
                        plane.datas = {
                            type: type,
                            name: name,
                            id: id,
                            info: info
                        }
                        plane.rotation.x = -Math.PI / 2 + 0.15;
                        plane.position.set(x, parseInt(y) + 7, z)
                        scene.add(plane)
                        this.options.data.push(plane)
                    })
                    break;
                case 12:
                    //地板
                    // 图片 宽 高 标题名 标题颜色1黄色2蓝色
                    let info_arr = info.split(",")
                    if (info_arr.length != 5) {
                        console.warn("信息不正确", name)
                        return
                    }
                    this.loadImg({
                        width: info_arr[1],
                        height: info_arr[2],
                        img: IMG_SRC + info_arr[0]
                    }, (canvas) => {
                        let routerName = new THREE.Texture(canvas);
                        routerName.needsUpdate = true;
                        let geometry = new THREE.PlaneGeometry(info_arr[1], info_arr[2], 6);
                        let material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });
                        let plane = new THREE.Mesh(geometry, material);
                        plane.datas = {
                            type: type,
                            name: name,
                            id: id,
                            info: info
                        }
                        plane.rotation.x = Math.PI / 2;
                        plane.position.set(x, y, z);
                        scene.add(plane);
                        this.options.data.push(plane);
                    })
                    if (info_arr[3] != 'false') {
                        //不需要字的地板 
                        let [twidth, theight] = [256, 64]
                        let color = info_arr[4] == '1' ? '#ffba47' : '#0094f8'
                        let textImg = this.loadText({ width: twidth, height: theight, text: info_arr[3], color: color })

                        let routerName = new THREE.Texture(textImg);
                        routerName.needsUpdate = true;
                        let geometry = new THREE.PlaneGeometry(twidth, theight, 6);
                        let material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });
                        let plane = new THREE.Mesh(geometry, material);
                        plane.datas = {
                            type: type,
                            name: name,
                            id: id,
                            info: info
                        }
                        plane.rotation.z = Math.PI * 2;
                        plane.rotation.x = -Math.PI / 8;
                        let p = (n) => {
                            return parseFloat(n)
                        }
                        plane.position.set(x, p(y) + theight / 2, p(z) + p(info_arr[2]) / 2 + 20);
                        scene.add(plane);
                        this.options.data.push(plane);
                    }
                    break;
            }


        }


        /*  switch (parseInt(type)) {
             case 1:
                 
                 break;
         }
  */
        /* var geometry = new THREE.BoxGeometry(30, 30, 30);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.datas = {
            type: type,
            name: name,
            id: id
        }
        this.options.data.push(cubew)
        this.scene.add(cube); */
        // this.updataLink()
    }
    addLink(item) {
        //添加连线 
        let line = this.toLink(item)
        this.scene.add(line);
        this.options.links.push(line)
    }
    toLink(item) {
        //添加连线 
        let LineBasicMaterial = this.Material.line;
        let { src, dst } = item;
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(src.x, src.y, src.z),
            new THREE.Vector3(dst.x, dst.y, dst.z)
        );
        var line = new THREE.Line(geometry, LineBasicMaterial);
        return line
    }
    clearAll() {
        this.options.data.forEach(node => {
            this.dispose(node)
        })
        this.options.links.forEach(link => {
            this.dispose(link)
        })
    }
    updataLink() {
        //更新所有节点
        let links = this.Vue.links;
        this.options.links.forEach(l => {
            this.dispose(l)
        })
        links.forEach(link => {
            this.addLink(link)
        })
    }
    deleteNode(id) {
        this.options.data.forEach(node => {
            if (node.datas.id == id) {
                this.dispose(node)
            }
        })
    }
}