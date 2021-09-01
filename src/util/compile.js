import web3 from "@/util/ethAbi";
import Bus from '@/bus';
import {
    addFunctionAbi
} from "@/util/api";

let obj;

export function compile(contract,that) {
    obj = that;
    let version = obj.$store.state.versionData;
    if (version && version.net !== 0) {
        compileHighVersion(contract) 
    }  
}

function compileHighVersion(contract) {
    let output;
    let input = {
        language: "Solidity",
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"]
                }
            }
        }
    };
    input.sources = {};
    input.sources[contract.contractName + ".sol"] = {};
    input.sources[contract.contractName + ".sol"] = {
        content: Base64.decode(contract.contractSource)
    };
    let that = obj;
    let w = that.$store.state.worker;
    w.postMessage({
        cmd: "compile",
        input: JSON.stringify(input),
        list: that.$store.state.contractDataList,
        path: contract.contractPath
    });
    w.addEventListener('message', function (ev) {
        if (ev.data.cmd == 'compiled') {
            output = JSON.parse(ev.data.data);
            if (output && output.contracts && JSON.stringify(output.contracts) != "{}") {
                that.status = 1;
                if (output.contracts[contract.contractName + ".sol"]) {
                     changeOutput(
                        output.contracts[contract.contractName + ".sol"],
                        contract
                    );
                }
            }else{
                // localStorage.setItem("complieStust","fail");
                that.$message({
                    type: "error",
                    message: that.$t("contracts.contractCompileFail")
                })
            } 
        }  
    });
    console.log('wwww:', w)
}

 

function changeOutput(obj,contract) {
    
    if (JSON.stringify(obj) !== "{}") {
        if (obj.hasOwnProperty(contract.contractName)) {
            let compiledMap = obj[contract.contractName]
            let data = {};
            let abiFile = compiledMap.abi;
            abiFile = JSON.stringify(abiFile);
            let bin = compiledMap.evm.deployedBytecode.object;
            let bytecodeBin = compiledMap.evm.bytecode.object;
            data.contractAbi = abiFile;
            data.contractBin = bin;
            data.bytecodeBin = bytecodeBin;
            data.contractSource = contract.contractSource; 
            data.contractVersion = contract.contractVersion;
            data.contractAddress = contract.contractAddress;
            data.contractName = contract.contractName;
            data.contractId = contract.contractId;
            data.contractPath = contract.contractPath;
            Bus.$emit("compile",data);
            setMethod(abiFile);
        } else {
            obj.$message({
                type: "error",
                message: obj.$t("contracts.conmileNameError")
            })
        }
    } else {
        obj.$message({
            type: "error",
            message: obj.$t("contracts.contractCompileFail")
        })
    }
}

function setMethod(abiFile) {
    let Web3EthAbi = web3;
    let arry = [];
    if (abiFile) {
        let list = JSON.parse(abiFile);
        list.forEach(value => {
            if (value.name && value.type == 'function') {
                let data = {}
                let methodId;
                if (localStorage.getItem("encryptionId") == 1) {
                    methodId = Web3EthAbi.smEncodeFunctionSignature({
                        name: value.name,
                        type: value.type,
                        inputs: value.inputs
                    });
                } else {
                    methodId = Web3EthAbi.encodeFunctionSignature({
                        name: value.name,
                        type: value.type,
                        inputs: value.inputs
                    });
                }
                data.methodId = methodId.substr(0,10);
                data.abiInfo = JSON.stringify(value);
                data.methodType = value.type
                arry.push(data)
            } else if (value.name && value.type == 'event') {
                let data = {}
                let methodId;
                if (localStorage.getItem("encryptionId") == 1) {
                    methodId = Web3EthAbi.smEncodeEventSignature({
                        name: value.name,
                        type: value.type,
                        inputs: value.inputs
                    });
                } else {
                    methodId = Web3EthAbi.encodeEventSignature({
                        name: value.name,
                        type: value.type,
                        inputs: value.inputs
                    });
                }
                data.methodId = methodId.substr(0,10);
                data.abiInfo = JSON.stringify(value);
                data.methodType = value.type
                arry.push(data)
            }
        })
        if (arry.length) {
            this.addAbiMethod(arry)
        }
    }
}


function addAbiMethod(list) {
    let data = {
        groupId: localStorage.getItem("groupId"),
        methodList: list
    }
    addFunctionAbi(data).then(res => {
        if (res.data.code === 0) {
            console.log("method 保存成功！")
        } else {
            obj.$message({
                message: obj.$chooseLang(res.data.code),
                type: "error",
                duration: 2000
            });
        }
    }).catch(err => {
        obj.$message({
            message: err.data || obj.$t('text.systemError'),
            type: "error",
            duration: 2000
        });
    })
}