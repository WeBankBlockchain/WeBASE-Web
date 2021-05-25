<template>
    <div>
        <el-form :model="appForm" :rules="rules" ref="appForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('text.useTmp')" v-if="handleType=='create'">
                <div>
                    <el-radio-group v-model="createRadio" @change="changeTemplate">
                        <el-radio :label="'tmp'">{{$t('text.changeTmp')}}</el-radio>
                        <el-radio :label="'create'">{{$t('text.customApplication')}}</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item :label="$t('text.appTmp')" prop="tmpId" style="width: 537px;" v-if="createRadio=='tmp'&&handleType=='create'">
                <el-select v-model="tmpId" :placeholder="$t('text.select')" @change="changeTmp" style="width: 437px;">
                    <el-option v-for="item in appList" :key="item.id" :label="item.appName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('text.appName')" prop="appName" style="width: 537px;">
                <el-input v-model="appForm.appName" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('text.appDocLink')" prop="appDocLink" style="width: 537px;">
                <el-input v-model="appForm.appDocLink" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('text.appDesc')" prop="appDesc" style="width: 537px;">
                <el-input type="textarea" v-model="appForm.appDesc" clearable :placeholder="$t('placeholder.input1_62')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('text.appDetail')" prop="appDetail" style="width: 537px;">
                <el-input type="textarea" v-model="appForm.appDetail" clearable :placeholder="$t('placeholder.input1_300')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('text.appIcon')" prop="fileList" style="width: 537px;">
                <!-- <img :src="appForm.appIcon" alt=""></img> -->
                <el-upload class="avatar-uploader" :file-list="fileList" action="" accept=".jpg, .png, ,jpeg" :show-file-list="true" :limit="1" list-type="picture-card" :http-request="uploadFile" :on-change="uploadChange" :auto-upload="true" :before-upload="beforeAvatarUpload">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}" class="avatar">
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <i class="el-icon-delete"></i>
                            </span>
                        </span>
                    </div>
                </el-upload>

                <span slot="default" class="img-icon">{{this.$t('text.imgSize')}}</span>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('appForm')">{{this.$t('text.sure')}}</el-button>
        </div>
    </div>
</template>
<script>
import { fetchSaveApp, fetchAppList } from "@/util/api";
export default {
    name: "AppDialog",
    props: ['appDialogInfo', 'handleType'],
    computed: {
        rules() {
            let data = {
                appName: [
                    {
                        required: true,
                        message: this.$t('rule.appNameRule'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$t('rule.textLong1_12'),
                        trigger: "blur"
                    },
                ],
                appDocLink: [
                    {
                        required: true,
                        message: this.$t('rule.appDocLinkRule'),
                        trigger: "blur"
                    },
                    {
                        pattern: /(http|https):\/\/([\w.]+\/?)\S*/,
                        message: this.$t('rule.appLinkDocRule'),
                        trigger: "blur"
                    }
                ],
                appDesc: [
                    {
                        required: true,
                        message: this.$t('rule.appDescRule'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 62,
                        message: this.$t('rule.textLong1_62'),
                        trigger: "blur"
                    }
                ],
                appDetail: [
                    {
                        required: true,
                        message: this.$t('rule.appDetailRule'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 300,
                        message: this.$t('rule.textLong1_300'),
                        trigger: "blur"
                    }

                ]
            }
            return data
        }
    },
    data() {
        return {
            appForm: {
                appName: this.appDialogInfo.appName || '',
                appDocLink: this.appDialogInfo.appDocLink || '',
                appIcon: this.appDialogInfo.appIcon || '',
                appDesc: this.appDialogInfo.appDesc || '',
                appDetail: this.appDialogInfo.appDetail || '',
            },
            imgString: '',
            fileList: [],
            appList: [],
            tmpId: '',
            createRadio: 'tmp'
        }
    },
    mounted() {
        if (this.handleType == 'create') {
            this.queryAppList()
        }
        this.initImg()
    },

    methods: {
        modelClose() {
            this.$emit('close')
        },
        initImg() {
            if (this.appDialogInfo.appIcon) {
                this.fileList.push({
                    url: this.appDialogInfo.appIcon
                })
                this.imgString = this.appDialogInfo.appIcon
            }
        },
        uploadFile(param) {
            var reader = new FileReader(), self = this;
            reader.readAsDataURL(param.file);
            reader.onload = function (e) {
                var fileString = e.target.result;
                self.imgString = fileString;
            }
        },
        beforeAvatarUpload(file) {
            return new Promise((resolve, reject) => {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    var txt = event.target.result;
                    var img = document.createElement("img");
                    img.src = txt;
                    img.onload = () => {
                        var imgWidth = img.width;
                        var imgHeight = img.height;
                        if (imgWidth == 80 && imgHeight == 80) {
                            resolve(file)
                        } else {
                            reject(this.$message.error(this.$t('text.imgSize80px')))
                        }
                        const isLt2M = file.size / 1024 < 200;
                        if (!isLt2M) {
                            this.$message.error(this.$t('text.imgSize200k'));
                        }
                    }
                }
            })
        },
        uploadChange(file, fileList) {
            this.$refs['appForm'].clearValidate();
            this.fileList = fileList
        },
        handleRemove(file) {
            this.imgString = ''
            this.fileList = []
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.sureModify()
                } else {
                    return false;
                }
            });
        },
        sureModify() {
            let param = {
                appName: this.appForm.appName,
                appDocLink: this.appForm.appDocLink,
                appDesc: this.appForm.appDesc,
                appDetail: this.appForm.appDetail,
                appIcon: this.imgString ? this.imgString : this.appForm.appIcon,
                id: this.appDialogInfo.id
            }
            fetchSaveApp(param)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.handleType == 'modify' ?this.$t('text.updateSuccessMsg') : this.$t('text.createSuccessMsg')
                        })
                        this.$emit('success')
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })

        },
        queryAppList() {
            let param = {
                appType: 1
            }
            fetchAppList(param)
                .then(res => {
                    if (res.data.code === 0) {
                        const { data } = res.data
                        this.appList = data;
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
        },
        changeTmp(val) {
            var tmpInfo;
            this.appList.forEach(item => {
                if (item.id == val) {
                    tmpInfo = item
                }
            });
            for (const key in this.appForm) {
                this.appForm[key] = tmpInfo[key]
            }
            this.fileList.push({
                url: this.appForm.appIcon
            })
            this.imgString = this.appForm.appIcon
        },
        changeTemplate(val) {
            this.tmpId = ''
            this.fileList = []
            this.imgString = ""
            if (val == 'create') {
                this.appForm = {
                    appName: '',
                    appDocLink: '',
                    appIcon: '',
                    appDesc: '',
                    appDetail: '',
                }

            }
        }

    }
}
</script>
<style scoped>
.avatar-uploader {
    display: flex;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
}
.avatar {
    width: 80px;
    height: 80px;
    display: block;
}
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
    padding-top: 12px;
}
.isNone {
    display: none;
}
.isShow {
    display: block;
}
.demo-ruleForm >>> .el-form-item__error {
    padding-top: 0;
}
.demo-ruleForm >>> .el-input__inner {
    border-radius: 2px;
}
.demo-ruleForm >>> .el-form-item {
    margin-bottom: 20px;
}
.demo-ruleForm >>> .el-upload-list--picture-card .el-upload-list__item {
    width: 100%;
    height: 80px;
}
.img-icon {
    font-size: 12px;
    color: #999999;
    line-height: 20px;
    font-weight: 400;
}
.demo-ruleForm >>> .el-upload--picture-card {
    background-color: #fff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    line-height: 86px;
    vertical-align: top;
}
.demo-ruleForm >>> .el-icon-plus {
    color: #e6e6e6;
}
</style>