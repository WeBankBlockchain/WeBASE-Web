<template>
    <div>
        <el-dialog
        title="引导页"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose">
            <div class="guide-content">
                <div class="guide-content-content">
                    <h3>添加节点前置</h3>
                    <p>节点前置和节点绑定的一个java服务的中间件，集成web3jsdk，webase平台通过该服务连接节点。</p>
                    <div>
                        <p>进入节点管理页面，点击新增节点前置，填写正确的ip和端口。</p>
                        <p style='width: 100%'><img :src="addFrontImg" alt="" style='width: 100%'></p>
                        <p style="color: #f00">注意：首次进入关掉此页面后会出现添加前置弹窗，在此弹窗添加前置即可。</p>
                    </div>
                </div>
                <div class="guide-content-content">
                    <h3>创建私钥用户</h3>
                    <p>如果需要部署合约，测试交易，需要创建私钥用户。</p>
                    <div>
                        <p>点击私钥管理进入，选择私钥用户，输入用户名。</p>
                        <p style='width: 100%'>
                            <img :src="addUserImg" alt="" style='width: 100%'>
                        </p>
                    </div>
                </div>
                <div class="guide-content-content">
                    <h3>创建合约</h3>
                    <p>创建用户后，便可以新增或上传合约，然后编译、部署和发送交易。点击合约管理，合约IDE进入。</p>
                    <div>
                        <p>点击合约管理，点击合约IDE，点击按钮进行编写或上传合约，然后编译、部署和发送交易。</p>
                        <p style='width: 100%'>
                            <img :src="createContractImg" alt="" style='width: 100%'>
                        </p>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="handleClose">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import addFront from "@/../static/image/add-front.png";
import addUser from "@/../static/image/add-user.png";
import createContract from "@/../static/image/create-contract.png";
export default {
    name: "guide",
    props: ['show'],
    data() {
        return {
            dialogVisible: this.show,
            addFrontImg: addFront,
            addUserImg: addUser,
            createContractImg: createContract
        }
    },
    methods: {
        handleClose() {
            this.$emit("close")
        }
    }
}
</script>

<style scoped>
.guide-content-content{
    margin-bottom: 20px;
}
</style>