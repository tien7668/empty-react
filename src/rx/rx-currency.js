
import web3_service from "src/services/web3_service";
import { BehaviorSubject } from "rxjs"
import { formatBigNumber } from "src/utils/fortmaters";
import rxBase from "src/rx/rx-base"
const init = {
    data: [{
        address: "0xc9b8548f0fdc231bdc08b74f5ac888677a15d620", 
        decimals: 18,
        balance: 0
    }]
}

const store = new BehaviorSubject(init)
export default {
    store, 
    useCurrency: rxBase.hook(store),
    fetchBalance: (address) => {
        if (!address) return; 
        let currencies = store.value.data
        for (let index in currencies) {
            web3_service.fetchTokenBalance(address, currencies[index].address).then((balance)=>{
                currencies[index].balance = +formatBigNumber(balance, currencies[index].decimals)
                store.next({data: currencies})
            })
        }
    }
} 