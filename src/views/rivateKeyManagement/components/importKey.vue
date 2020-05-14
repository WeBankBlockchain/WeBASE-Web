<template>
    <div class="key-dialog">
        <el-form :model="keyForm" :rules="rules" ref="keyForm" label-width="142px" class="demo-ruleForm">
            <el-form-item :label="$t('privateKey.fileName')" prop="fileName" style="width: 546px;">
                <el-input v-model="keyForm.fileName" :placeholder="$t('privateKey.inputFileName')" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item :label="$t('privateKey.fileType')" prop="fileType" style="width: 546px;">
                <el-radio-group v-model="keyForm.fileType">
                    <el-radio :label="item.enName" :key="item.enName" v-for="item in fileTypeList">{{item.enName}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button class="footer-button" @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-upload ref="upload" action :http-request="uploadFile" :before-upload="onBeforeUpload" :accept="keyForm.fileType" :outo-uploading="false" :show-file-list="false">
                <el-button type="primary" :disabled="disabled">{{this.$t('privateKey.importFile')}}</el-button>
            </el-upload>
        </div>
    </div>
</template>

<script>
import {  } from "@/util/api";
export default {
    name: 'importKey',

    components: {
    },

    props: {
    },

    data() {
        return {
            loading: false,
            disabled: false,
            keyForm: {
                fileName: "",
                fileType: ".txt"
            },
            fileTypeList: [
                {
                    enName: '.txt',
                },
                {
                    enName: '.pem',
                },
                {
                    enName: '.p12',
                }
            ]
        }
    },

    computed: {
        rules() {
            let data = {
                fileName: [
                    {
                        required: true,
                        message: this.$t('privateKey.inputFileName'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$t('rule.textLong1_12'),
                        trigger: "blur"
                    }
                ],
                fileType: [
                    {
                        required: true,
                        message: this.$t('privateKey.inputFileType'),
                        trigger: "blur"
                    }
                ]
            };
            return data
        }
    },

    watch: {
    },

    created() {
    },

    mounted() {
    },

    methods: {
        modelClose() {
            this.keyForm = Object.assign({
                fileName: "",
                fileType: ""
            });
            this.loading = false;
            this.$store.state.importRivateKey = false;
        },
        onBeforeUpload(file) {
            
        },
        uploadFile(param) {
            this.$refs['keyForm'].validate(valid => {
                if (valid) {
                    var reader = new FileReader(), self = this;
                    reader.readAsText(param.file, "UTF-8");
                    reader.onload = function (e) {
                        var fileString = e.target.result;
                        self.postFile(fileString)
                    }
                    this.$refs.upload.clearFiles()
                } else {
                    return false;
                }
            });

        },
        postFile(fileString) {
            let param = {
                content: fileString,
                fileType: this.keyForm.fileName
            }
            console.log('postFile',param)
            importCert(param).then(res => {
                const { data } = res;
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('system.importSuccess'),
                    })
                    this.$emit('importRivateKeySuccess')
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
    }
}
</script>

<style scoped>
.footer-button {
    margin-right: 10px;
}
.dialog-footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-bottom: 20px;
}
</style>
