import rxAccount from "src/rx/rx-account";
import { useEffect } from 'react'
import rxCurrency from "src/rx/rx-currency";
import metamaskWallet from "src/services/metamask_wallet"
import privateKeyWallet from "src/services/private_key_wallet"
import walletConnectWallet from "src/services/wallet_connect_wallet"
export default function useFetchingInitData() {
    const account = rxAccount.useAccount()
    useEffect(() => {
        if (account.address) { 
            rxAccount.getAccountID()
        }
        const interval = setInterval(() => {
            rxCurrency.fetchBalance(account.address)
        }, 2000)
        return () => clearInterval(interval)
    }, [account.address])
    useEffect(async () => {
        let address = localStorage.getItem("address");
        let type = localStorage.getItem("type");
        if (address && type) connectWallet(type) 
    }, [])
}

const connectWallet = async (type) => {
    let address = localStorage.getItem("address");
    let privateKey = localStorage.getItem("privateKey");
    let zkPrivateKey = localStorage.getItem("zkPrivateKey");
    let zkPublicKey = localStorage.getItem("zkPublicKey");
    let wallet
    if (type == "metamask") {
        const metamask = metamaskWallet()
        rxAccount.import({wallet: metamask, address, type, privateKey, zkPrivateKey, zkPublicKey});
        metamask.connect(() => {alert("connect err")}, () => {alert("network err")});
        metamask.getDisconnected(rxAccount.clear)
    }else if (type == "private") {
        rxAccount.import({wallet: privateKeyWallet(), address, type, privateKey, zkPrivateKey, zkPublicKey})
    }else if (type == "walletconnect"){
        const walletConnect = walletConnectWallet()
        walletConnect.connect()
        rxAccount.import({wallet: walletConnect, address, type, privateKey, zkPrivateKey, zkPublicKey})
    }
    return wallet
} 