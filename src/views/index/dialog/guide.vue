<template>
    <div>
        <el-dialog
        :title="$t('guide.guidePage')"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose">
            <div class="guide-content">
                <div class="guide-content-content">
                    <h3>{{$t('guide.addFront')}}</h3>
                    <p>{{$t('guide.addFrontTip1')}}</p>
                    <div>
                        <p>{{$t('guide.addFrontTip2')}}</p>
                        <p style='width: 100%'><img :src="addFrontImg" alt="" style='width: 100%'></p>
                        <p style="color: #f00">{{$t('guide.addFrontTip3')}}</p>
                    </div>
                </div>
                <div class="guide-content-content">
                    <h3>{{$t('guide.addUser')}}</h3>
                    <p>{{$t('guide.addUserTip1')}}</p>
                    <div>
                        <p>{{$t('guide.addUserTip1')}}</p>
                        <p style='width: 100%'>
                            <img :src="addUserImg" alt="" style='width: 100%'>
                        </p>
                    </div>
                </div>
                <div class="guide-content-content">
                    <h3>{{$t('guide.createContract')}}</h3>
                    <p>{{$t('guide.createContractTip1')}}</p>
                    <div>
                        <p>{{$t('guide.createContractTip2')}}</p>
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