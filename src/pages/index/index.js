import "./index.less";
import Vue from 'vue/dist/vue.js'
import { GetRequest } from '../../utils/full'
import ScrollPer from '../../utils/scroll'
import Topo from '../../utils/topo'
import Perview from '../../utils/perview'
import MORE from '../../assets/image/more.png'
import axios from 'axios'
import JSONS from '../../utils/ex.json'
let query = GetRequest();
const types = [
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
]
let VM = new Vue({
    el: "#app",
    data() {
        const meshs = types.map((elem, index) => ({
            name: elem.name,
            id: elem.type,
            type: elem.type,
            img: "/assets/image/serve/" + elem.img
        }))
        const sences = [...new Array(15)].map((elem, index) => ({
            name: `测试${index}`,
            id: index,
            type: index,
            img: "/assets/image/serve.png"
        }))
        return {
            more: MORE,
            scroll: null,
            models: [
                { name: "关系", id: 1 },
                { name: "模型", id: 2 },
                { name: "场景", id: 3 },
                { name: "属性", id: 4 },
            ],
            model_state: 2,
            modelsMesh: meshs,
            modelsActiveMesh: null,
            scenesList: sences,
            operating: [
                { name: "配置", id: 1 },
                { name: "导出", id: 2 },
                { name: "导入", id: 3 },
                { name: "连线", id: 4 },
                { name: "清空", id: 5 },
                { name: "完成", id: 6 },
            ],
            types: [

            ],
            modal: null,
            currentModel: null,
            currentId: 0,
            nodes: [],
            lines: [],
            currentLine: {},
            graphLineNode: "",
            createOptions: {
                name: ""
            },
            currentNode: null,//click current node
            currentNodeOptions: {
                x: "",
                y: "",
                z: "",
                rotationX: "",
                rotationY: "",
                rotationZ: "",
                name: "",
                type: "",
                mtl: "",
                width: "",
                height: ""
            },
            currentClickPosition: {},
            importHTML: ""

        }
    },
    computed: {

    },
    mounted() {
        this.scroll = ScrollPer("#scroll")
        setTimeout(() => {
            this.imports()
            console.log(this.lines)
        }, 3000)
    },
    methods: {
        tabClick(id) {
            this.model_state = id;
        },
        addMesh(item) {
            // models added mesh
            this.currentModel = item;
            this.createOptions.name = item.name
            this.modal = 1;
        },
        createModal() {
            // click create modal
            this.currentModel.type
            const { type, img } = this.currentModel;
            const { name } = this.createOptions;
            if (name === "") {
                return alert("name cannot be empty")
            }
            topo.initDrag({
                id: ++this.currentId,
                type,
                name,
                img,
                src: this.graphLineNode
            })
            this.modal = null;
            this.graphLineNode = ""
        },
        currentNodeWatch() {
            if (this.currentNodeOptions) {
                return true
            }
        },
        setCurrentNode(node) {
            this.model_state = 4;
            this.currentNode = node;
            // position 
            this.currentNodeOptions.x = node.position.x
            this.currentNodeOptions.y = node.position.y
            this.currentNodeOptions.z = node.position.z
            //ratotion 
            this.currentNodeOptions.rotationX = node.rotation._x
            this.currentNodeOptions.rotationY = node.rotation._y
            this.currentNodeOptions.rotationZ = node.rotation._z
            //options  
            this.currentNodeOptions.name = node.options.name || ""
            this.currentNodeOptions.type = node.options.type || ""
            this.currentNodeOptions.mtl = node.options.mtl || ""
            this.currentNodeOptions.width = node.options.width || ""
            this.currentNodeOptions.height = node.options.height || ""
        },
        fileUpload(event) {
            let file = event.target.files[0]
            new Perview({
                el: "#uploadCanvas",
                file: event.target.value
            })
            var data = new FormData(); //重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
            data.append("attachment", file);
            axios.post("/api/upload", {
                file: file
            })
        },
        modifyLine(item) {
            this.currentLine = item;
            console.log(item)
            topo.thingLine(item)
        },
        currentLineChange() {
            //replacement line
            topo.replacement(this.currentLine)
        },
        addCurrentLine(index) {
            this.currentLine.lines.splice(index + 1, 0, {
                x: 0, y: 0, z: 0
            })
        },
        deleteCurrentLine(index) {
            this.currentLine.lines.splice(index, 1)
        },
        updateLine() {
            if (this.currentNode) {
                const { x, y, z } = this.currentNode.position;
                console.log(this.currentNode)
                this.nodes.forEach(n => {
                    if (n.id == this.currentNode.options.id) {
                        n.x = x
                        n.y = y
                        n.z = z
                    }
                })
                this.lines.forEach(line => {
                    if (line.src.id == this.currentNode.options.id) {
                        line.src.x = x
                        line.src.y = y
                        line.src.z = z
                        line.lines[0].x = x
                        line.lines[0].y = y
                        line.lines[0].z = z
                        topo.replacement(line)
                    }
                    if (line.dst.id == this.currentNode.options.id) {
                        line.dst.x = x
                        line.dst.y = y
                        line.dst.z = z
                        let index = line.lines.length - 1
                        line.lines[index].x = x
                        line.lines[index].y = y
                        line.lines[index].z = z
                        topo.replacement(line)
                    }
                })
            }

        },
        optionsEvent(id) {
            switch (id) {
                case 1: break;
                case 2:
                    this.export()
                    break;
                case 3:
                    this.modal = 3;
                    break;
                case 5:
                    topo.clearMesh()
                    break;
            }
        },
        export() {
            // export json 
            let nodes = this.nodes.map(node => {
                return {
                    x: node.x,
                    y: node.y,
                    z: node.z,
                    type: node.type,
                    name: node.name,
                    img: node.img,
                    id: node.id
                }
            })
            let lines = this.lines.map(line => {
                return {
                    src: line.src.id,
                    dst: line.dst.id,
                    lines: line.lines
                }
            })
            let data = {
                lines, nodes
            }
            localStorage.setItem("datas-topo", data)
            console.log(data)
            console.log(JSON.stringify(data))
        },
        imports() {
            //import json 
            // let { nodes, lines } = JSON.parse(this.importHTML);
            let { nodes, lines } = JSONS;
            /* lines.forEach(x => {
                nodes.forEach(y => {
                    if (x.src == y.id) { 
                        y.x = x.lines[0].x
                        y.y = x.lines[0].y
                        y.z = x.lines[0].z
                    }
                    if (x.dst == y.id) {
                        let l = x.lines.length - 1
                        y.x = x.lines[l].x
                        y.y = x.lines[l].y
                        y.z = x.lines[l].z
                    }
                })
            }) */
            nodes.forEach(node => {
                if (node.id > this.currentId) {
                    this.currentId = parseInt(node.id) + 1
                }
                topo.addMesh(
                    {
                        x: node.x,
                        y: node.y,
                        z: node.z,
                    },
                    {
                        type: node.type,
                        name: node.name,
                        img: node.img,
                        id: node.id
                    })
            })
            setTimeout(() => {
                lines.forEach(item => {
                    topo.addBasicLine(item)
                })
                this.modal = null;
            }, 200)

        },
        deletebtn() {
            topo.deleteMesh(this.currentNode).then(res => {
                this.currentNode = null
            })
        }
    },

    watch: {
        model_state() {
            document.querySelector("#scroll").scrollTop = 0
            this.scroll.update()
        },
        ['currentNodeOptions.x'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.position.x = val;
                this.updateLine()
            }
        },
        ['currentNodeOptions.y'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.position.y = val
                this.updateLine()
            }
        },
        ['currentNodeOptions.z'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.position.z = val
                this.updateLine()
            }
        },
        ['currentNodeOptions.rotationX'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.rotation.x = val
            }
        },
        ['currentNodeOptions.rotationY'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.rotation.y = val
            }
        },
        ['currentNodeOptions.rotationZ'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.rotation.z = val
            }
        },
        ['currentNodeOptions.name'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.options.name = val
            }
        },
        ['currentNodeOptions.type'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.options.type = val
                this.nodes.forEach(x => {
                    if (x.id == this.currentNode.options.id) {
                        let n = this.modelsMesh.filter(c => c.type == val)[0]
                        x.img = n.img
                        x.name = n.name
                        x.type = n.type
                    }
                })
                this.currentNode.options.img = this.modelsMesh.filter(x => x.type == val)[0].img
                this.currentNodeOptions.name = this.modelsMesh.filter(x => x.type == val)[0].name
            }
        },
        ['currentNodeOptions.mtl'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.options.mtl = val
            }
        },
        ['currentNodeOptions.width'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.options.width = val
            }
        },
        ['currentNodeOptions.height'](val) {
            if (this.currentNodeWatch()) {
                this.currentNode.options.height = val
            }
        },
        ['currentLine.src.id'](val) {
            console.log(val)
            let node = this.nodes.filter(x => x.id == val)[0]
            this.currentLine.src.x = node.x
            this.currentLine.src.y = node.y
            this.currentLine.src.z = node.z
            this.currentLine.lines[0].x = node.x
            this.currentLine.lines[0].y = node.y
            this.currentLine.lines[0].z = node.z
            this.currentLineChange()
        }

    }
})
let topo = new Topo({
    watch: data => {
        // watch added mesh 
        VM.nodes = data.map(mesh => ({
            ...mesh.options,
            ...mesh.position
        }))
    },
    lineWach: data => {
        VM.lines = data
        console.log(data)
    },
    click: data => {
        // get the first node
        let node = null;
        let index = 0;
        let len = data.length;
        while (index < len) {
            if (data[index].object.MeshType === "model") {
                node = data[index].object;
                index = len;
            }
            index++;
        }
        for (let i = 0; i < len; i++) {
            if (data[i].object.MeshType === "floor") {
                let arr = Object.values({ ...data[i].point, y: 0 });
                arr = arr.map(x => parseInt(x))
                VM.currentClickPosition = arr
            }
        }
        if (node) {
            VM.setCurrentNode(node)
        } else {
            // VM.currentNode = 
        }
    }
})  
