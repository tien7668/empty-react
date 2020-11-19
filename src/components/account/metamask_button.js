import metamaskWallet from "src/services/metamask_wallet"
import rxAccount from "src/rx/rx-account"
export default () => {
    const connectMetamask = async () => {
        const metamask = metamaskWallet()
        const data = await metamask.connect(() => {alert("connect err")}, () => {alert("network err")});
        rxAccount.import({address : data.address, zkPrivateKey: data.zkPrivateKey, zkPublicKey: data.zkPublicKey, type: "metamask", wallet: metamask})   
        metamask.getDisconnected(rxAccount.clear)
    } 
    return <button onClick={connectMetamask}> metamask </button>
} 