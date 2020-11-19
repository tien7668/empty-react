import WalletConnect from "walletconnect";
import rxAccount from "src/rx/rx-account";
export default (state = {connectorSDK: new WalletConnect()}) => {
    return {
        connect: async (onEthereumError = null, onNetworkError = null) => {
            const connector = await state.connectorSDK.connect()
            if (rxAccount.store.value.address) return  
            const zkKeyPair = {zkPrivateKey: "0x03ebfd45eb18b5edba1e9dd0a66ae13aabc8cd89710982f88f51922a3b442d54" , zkPublicKey: "0x044baf7cfbdcf181234bfd270a184da4a98cd146a540a64439a1118fd63b2413"}
            return {address: connector.accounts[0], zkPrivateKey: zkKeyPair.zkPrivateKey, zkPublicKey: zkKeyPair.zkPublicKey, type: "walletconnect"}
        },
        makeTransaction: async (txObject) => {
            let txHash
            txHash = await state.connectorSDK.connector.sendTransaction(txObject)
            return txHash
        },
        getDisconnected: (clearAccount) => {
            state.connectorSDK.connector.on("disconnect", () => {
              this.handleClearAccount(clearAccount);
            });
        
            state.connectorSDK.connector.on("session_update", () => {
              this.handleClearAccount(clearAccount);
            });
        }
    } 
} 