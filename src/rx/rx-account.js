import { BehaviorSubject } from 'rxjs';
import Web3Service from 'src/services/web3_service';
import rxBase from "src/rx/rx-base"
const init = () =>({
    address: localStorage.getItem("address"), 
    type: localStorage.getItem("type"), 
    id: null, 
    privateKey: localStorage.getItem("privateKey"),
    zkPrivateKey: localStorage.getItem("zkPrivateKey"), 
    zkPublicKey: localStorage.getItem("zkPublicKey"),
    wallet: null,
    txHash: null 
}) 

const store = new BehaviorSubject(init())
export default { 
    store: store, 
    useAccount: rxBase.hook(store),
    import: ({address, type, privateKey, zkPrivateKey, zkPublicKey, wallet}) => {
        store.next({...store.value, address, type, privateKey, zkPrivateKey, zkPublicKey, wallet}); 
        localStorage.setItem("address", address);
        localStorage.setItem("type", type);
        if (privateKey) localStorage.setItem("privateKey", privateKey);
        localStorage.setItem("zkPrivateKey", zkPrivateKey);
        localStorage.setItem("zkPublicKey", zkPublicKey);
    }, 
    clear: () => {
        localStorage.removeItem("address");
        localStorage.removeItem("type");
        localStorage.removeItem("privateKey");
        localStorage.removeItem("zkPrivateKey");
        localStorage.removeItem("zkPublicKey");
        store.next(init())
    },
    getAccountID: async () => {
        const accountID = await Web3Service.getAccountID(store.value.zkPublicKey)
        store.next({...store.value, id: accountID })
    },
    setTxHash: (txHash) => {
        store.next({...store.value, txHash })   
    }
}