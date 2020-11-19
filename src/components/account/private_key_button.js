import modalService from "src/services/single_modal_service";
import { validatePrivateKey, addressFromPrivateKey } from "src/utils/keys";
import {useState} from 'react'
import rxAccount from "src/rx/rx-account";
import ethers from "ethers" 
import web3Service from "src/services/web3_service";
import privateKeyWallet from "src/services/private_key_wallet";

const PrivateKeyModal = () => {
    const [priv, setPriv] = useState("")
    const submitKey = async (pKey) => {
        const address = addressFromPrivateKey(pKey);
        const zkKeyPair = await web3Service.getZkKeyPair(new ethers.Wallet("0x" + pKey))
        const wallet = privateKeyWallet()
        rxAccount.import({address : address, zkPrivateKey: zkKeyPair.zkPrivateKey, zkPublicKey: zkKeyPair.zkPublicKey, type: "private", privateKey: pKey, wallet})   
        modalService.show("")
    } 
    return (<><input placeholder={"key"} onChange={(e)=> setPriv(e.target.value) }></input>
        <button onClick={() => submitKey(priv)}>submit</button></>)
} 

export default () => {
    return  <button onClick={() => modalService.show(<PrivateKeyModal />)}>
                private key
            </button>
}