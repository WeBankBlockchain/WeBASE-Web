<template>
    <div class="account-wrapper">
        <content-head :headTitle="$t('text.noviceGuide')"></content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <div class="guide-link">{{$t("text.click")}}<span class="link" @click='link'> {{$t("text.here")}} </span>{{$t("text.enterHost")}}</div>
            <div>
                <h1 class="h1">1. {{$t("text.environmentReady")}}</h1>
                <p>1.1 {{$t("text.readyAnsibleInfo")}}</p>
                <p>1.2 {{$t('text.readyDockerInfo')}}</p>
            </div>
            <div>
                <h1 class="h1">2. {{$t('text.visualization')}}</h1>
                <div>
                    <h2 class="h2">（1）{{$t('text.addHost')}}</h2>
                    <p>{{$t("text.addHostInfo")}}</p>
                    <img class="guide-image" src="../../../static/image/add-host.png" alt="">
                </div>
                <div>
                    <h2 class="h2">（2）{{$t("text.addCheckNode")}}</h2>
                    <p>{{$t('text.addCheckNodeInfo1')}}</p>
                    <p>{{$t('text.addCheckNodeInfo2')}}</p>
                    <p>{{$t('text.addCheckNodeInfo3')}}</p>
                    <img class="guide-image" src="../../../static/image/add-node.png" alt="">
                    <p>{{$t("text.checkNodeInfo")}}</p>
                    <p>{{$t('text.initializationInfo')}}</p>
                    <img class="guide-image" src="../../../static/image/node2.png" alt="">
                </div>
                <div>
                    <h2 class="h2">（3）{{$t("text.deployStartChain")}}</h2>
                    <p>{{$t("text.deployStartChainInfo")}}</p>
                </div>
            </div>
            <!-- <div>
                <p>1. 配置Absible</p>
                <div>xxxxxxxxxxxxxxxxxxxxx</div>
            </div>
            <div>
                <p>2. 启动Docker</p>
                <div>xxxxxxxxxxxxxxxxxxxxx</div>
            </div>
            <div>
                <p>3. 添加主机</p>
                <div>xxxxxxxxxxxxxxxxxxxxx</div>
            </div>
            <div>
                <p>4. 添加节点并检测</p>
                <div>xxxxxxxxxxxxxxxxxxxxx</div>
            </div>
            <div>
                <p>5. 部署链</p>
                <div>xxxxxxxxxxxxxxxxxxxxx</div>
            </div> -->
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
export default {
    name: "guides",
    components: {
        contentHead
    },
    data() {
        return {
            activeNames: ['1']
        }
    },
    methods: {
        link() {
            this.$router.push("/host")
        }

    }
}
</script>

<style scoped>
.guide-link {
    float: right;
}
.h1 {
    font-size: 20px;
    padding: 10px 0;
}
.h2 {
    font-size: 16px;
    padding: 5px 0;
}
.guide-image {
    width: 100%;
}
</style>