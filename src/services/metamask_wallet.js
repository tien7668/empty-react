import ENV from "../configs/env";
import Web3 from "web3";
import rxAccount from "src/rx/rx-account";
import Web3Service from 'src/services/web3_service'
import { ethers } from "ethers"
export default (state = { ethereum: window.ethereum, web3: new Web3(window.ethereum || Web3.givenProvider || window.web3.currentProvider || window.web3.givenProvider)}) => {
    
    return {
        connect: async (onEthereumError = null, onNetworkError = null) => {
            if (!state.ethereum) {
                if (typeof onEthereumError === "function") onEthereumError();
                return false;
            } 
    
            const currentNetworkId = +state.ethereum.networkVersion
            if (currentNetworkId !== ENV.NETWORK_ID ) {
                if (typeof onNetworkError === "function") onNetworkError(currentNetworkId);
                return false;
            } 
            if (rxAccount.store.value.address) {
                await state.ethereum.enable()
                return  
            }
            
            const accounts = await state.ethereum.enable()
            const zkKeyPair = await Web3Service.getZkKeyPair(new ethers.providers.Web3Provider(state.ethereum).getSigner())
            return { address : accounts[0], zkPrivateKey: zkKeyPair.zkPrivateKey, zkPublicKey: zkKeyPair.zkPublicKey, type: "metamask"}
        }, 
        getDisconnected: (clearAccount) => {
            if (state.ethereum) {
                state.ethereum.on("accountsChanged", (accounts) => {
                    if (accounts[0] === rxAccount.store.value.address) return;
                    clearAccount()
                })
                state.ethereum.on("chainChanged", (networkId) => {
                    if (+networkId === ENV.NETWORK_ID) return;
                    console.log("chainChanged")
                    clearAccount();
                })
            }  
        },
        makeTransaction: async (txObject) => {
            let txHash;
            txHash = await new Promise((resolve, reject) => {
              state.web3.eth.sendTransaction(txObject, function (err, txHash) {
                if (!err) {
                  resolve(txHash);
                } else {
                  reject(err.message);
                }
              });
            });
            return txHash
        }
    }
}