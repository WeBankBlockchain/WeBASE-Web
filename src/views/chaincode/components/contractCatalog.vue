<template>
    <div class="contract-menu">
        <div class="contract-menu-header">
            <el-tooltip class="item" effect="dark" content="新建文件夹" placement="top-start">
                <i class="wbs-icon-Addfolder icon contract-icon" @click='addFolder'></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="新建文件" placement="top-start">
                <i class="wbs-icon-Addfile icon contract-icon" @click='addFile'></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="上传文件" placement="top-start">
                <i class="wbs-icon-shangchuan contract-icon" style="position:relative;">
                    <input type="file" id="file" ref='file' name="chaincodes" class="uploads"  @change="upload($event)"/>
                </i>
            </el-tooltip>
            
        </div>
        <div class="contract-menu-content">
            <ul>
                <li v-for='item in contratcArry' :key="item.contractId">
                    <div v-if='item.contractType == "file"' class="contract-file">
                        <i class="wbs-icon-file" @click='select(item)'></i>
                        <span @click='select(item)' :class="{'colorActive': item.contractActive}">{{item.contractName}}</span>
                        <i class="wbs-icon-delete contract-delete" @click="deleteFile(item)"></i>
                    </div>
                    <div v-if='item.contractType == "folder"' class="contract-folder">
                        <i :class="item.folderIcon" @click='open(item)'></i>
                        <i class="wbs-icon-folder" style="color: #d19650"></i>
                        <span>{{item.contractName}}</span>
                        <i class="wbs-icon-delete contract-delete" @click='deleteFolder(item)'></i>
                        <br>
                        <ul v-if="item.folderActive" style="padding-left: 20px;">
                            <li class="contract-file" v-for='list in item.child' :key="list.contractId">
                                <i class="wbs-icon-file" @click='select(list)'></i>
                                <span @click='select(list)' :class="{'colorActive': list.contractActive}">{{list.contractName}}</span>
                                <i class="wbs-icon-delete contract-delete" @click="deleteFile(list)"></i>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <add-folder v-if="foldershow" :foldershow="foldershow" @close='folderClose' @success='folderSuccess'></add-folder>
        <add-file v-if="fileshow" :fileshow="fileshow" @close='fileClose' @success='fileSucccess($event)'></add-file>
        <select-catalog v-if='cataLogShow' :show='cataLogShow' @success='catalogSuccess($event)' @close='catalogClose'></select-catalog>
    </div>
</template>
<script>
import addFolder from "../dialog/addFolder"
import addFile from "../dialog/addFile"
import selectCatalog from "../dialog/selectCatalog"
import Bus from '@/bus'
export default {
    name: "contractCatalog",
    components: {
        "add-folder": addFolder,
        "add-file": addFile,
        "select-catalog": selectCatalog
    },
    data: function(){
        return {
            foldershow: false,
            fileshow: false,
            filename: "",
            fileString: "",
            contractList: [],
            folderList: [],
            contratcArry: [],
            contractData: null,
            cataLogShow: false,
        }
    },
    mounted: function(){
        this.$nextTick(function() {
            this.getContracts()
        })
        Bus.$on("compile",data => {
            this.contractList.forEach(value => {
                if(value.contractId == data.contractId){
                    value = data
                }
            })
            localStorage.setItem("contractLists",JSON.stringify(this.contractList))
            this.getContracts(data)
        })
    },
    methods: {
        addFolder: function(){
            this.foldershow = true
        },
        addFile: function(){
            this.fileshow = true
        },
        upload: function(e){
            if(!e.target.files.length){
                return
            }
            this.filename = "";
            this.fileString = "";
            let files = e.target.files[0];
            let filessize = Math.ceil(files.size / 1024);
            let filetype = files.name.split(".")[1];
            if (filessize > 400) {
                this.$message({
                    message: '文件大小超过400k，请上传小于400k的文件',
                    type: "error"
                });
            } else if (filetype !== "sol") {
                this.$message({
                    message: '请上传.sol格式的文件',
                    type: "error"
                });
            } else {
                this.filename = files.name.split(".")[0];
                this.file = files.name;
                let reader = new FileReader(); //新建一个FileReader
                reader.readAsText(files, "UTF-8"); //读取文件
                let _this = this;
                reader.onload = function(evt) {
                    _this.fileString = Base64.encode(evt.target.result); // 读取文件内容
                    if(_this.fileString){
                        _this.cataLogShow = true;

                    }
                };
            }
            this.$refs.file.value = "";
        },
        catalogSuccess: function(val){
            let data = {
                contractName: this.filename,
                contractSource: this.fileString,
                contractFolder: val,
                contractType: 'file',
                contractActive: false,
                contractstatus: 0,
                contractAbi: "",
                contractBin: "",
                contractAddress: "",
                contractVersion: "",
                contractNo: (new Date()).getTime()
            }
            this.contractList.unshift(data)
            localStorage.setItem("contractLists",JSON.stringify(this.contractList))
            this.getContracts();
            this.catalogClose()
        },
        catalogClose: function(){
            this.cataLogShow = false
        },
        folderClose: function(){
            this.foldershow = false
        },
        folderSuccess: function(){
            this.folderClose()
            this.getContracts();  
        },
        fileClose: function(){
            this.fileshow = false
        },
        getContracts: function(val){
            let result = [];
            let list = [];
            if(localStorage.getItem("contractLists")){
                this.contractList = JSON.parse(localStorage.getItem("contractLists"))
            }else{
                this.contractList = []
            }
            list = this.contractList;
            let folderArry = this.createFolder();
            let newFileList = [];
            list.forEach(value => {
                if(value.contractFolder == "/"){
                    newFileList.push(value)
                }
            })
            folderArry.forEach(value => {
                value.child = [];
                list.forEach((item,index) => {
                    if(item.contractFolder == value.contractName){
                        value.child.push(item)
                    }
                })
            })
            result = newFileList.concat(folderArry);
            console.log(result)
            this.contratcArry = result;
            if(this.contractList.length && !val){
                this.select(this.contractList[0])
            }else if(val){
                this.select(val)
            }
        },
        fileSucccess: function(val){
            this.contractList.unshift(val)
            localStorage.setItem("contractLists",JSON.stringify(this.contractList))
            this.getContracts()
            this.fileClose()
        },
        createFolder: function(){
            let result = []
            if(localStorage.getItem("folderList")){
                this.folderList =JSON.parse(localStorage.getItem("folderList")) 
            }else{
                this.folderList = []
            }
            this.folderList.forEach(value => {
                let num = 0
                let data = {
                        contractName: value.folderName,
                        contractNo: value.folderId,
                        contractActive: false,
                        contractType: 'folder',
                        folderIcon: "wbs-icon-jiantouarrow483",
                        folderActive: true,
                    }
                result.push(data);
            })
            return result
            console.log(result)
        },
        open: function(val){
            if(val.folderActive){
                this.$set(val,'folderActive',false)
                this.$set(val,'folderIcon','wbs-icon-jiantouarrow487')
            }else{
                this.$set(val,'folderActive',true)
                this.$set(val,'folderIcon','wbs-icon-jiantouarrow483')
            }
        },
        select: function(val){
            let num = 0;
            this.contratcArry.forEach(value => {
                if(value.contractNo == val.contractNo){
                    this.$set(value,'contractActive',true)
                }else if(value.contractType == 'folder'){
                    value.child.forEach(item => {
                        if(item.contractNo == val.contractNo){
                            this.$set(item,'contractActive',true)
                        }else{
                            this.$set(item,'contractActive',false)
                        }
                    })
                }else{
                    this.$set(value,'contractActive',false)
                }
            })
            Bus.$emit('select',val)
        },
        deleteFile: function(val){
            this.contractList.forEach((value,index) => {
                if(value.contractNo == val.contractNo){
                    this.contractList.splice(index,1)
                }
            })
            localStorage.setItem("contractLists",JSON.stringify(this.contractList));
            this.getContracts();
        },
        deleteFolder: function(val){
            let list = val.child
            this.contractList.forEach((value,index) => {
                list.forEach(item => {
                    if(value.contractNo == item.contractNo){
                        this.contractList.splice(index,1)
                    }
                })
            })
            this.folderList = JSON.parse(localStorage.getItem("folderList")) || []
            this.folderList.forEach((value,index) => {
                if(value.folderId == val.contractNo){
                    this.folderList.splice(index,1)
                }
            })
            localStorage.setItem("folderList",JSON.stringify(this.folderList));
            localStorage.setItem("contractLists",JSON.stringify(this.contractList));
            this.getContracts();
        }
    }
}
</script>
<style scoped>
.icon{
    font-weight: bold;
}
.contract-menu-header{
    width: calc(100% + 1px);
    height: 48px;
    line-height: 48px;
    border-bottom: 2px solid #e7ebf0;
    padding-left: 20px;
}
.contract-icon{
    vertical-align: middle;
    padding-left: 10px;
    cursor: pointer;
}
.checkContract-upload {
        display: block;
        position: absolute;
        height: 30px;
        left: 0;
        margin-top: -30px;
        width: 100%;
        opacity: 0;
        /* -ms-filter: "alpha(opacity=0)"; */
        z-index: 9;
        cursor: pointer;
}
.contract-file{
    padding-left: 25px;
}
.contract-folder{
    padding-left: 5px;
}
.contract-folder i{
    cursor: pointer;
}
.contract-file span{
    cursor: pointer;
}
.contract-file i{
    cursor: pointer;
}
.uploads{
    position: absolute;
    width: 18px;
    height: 18px;
    left: 10px;
    top: 0;
    opacity: 0;
    z-index: 999;
    cursor: pointer;
}
.colorActive{
    color: rgb(55, 238, 242);
}
.contract-delete{
    padding-left: 20px;
    font-weight: 100;
    font-size: 16px;
}

</style>


