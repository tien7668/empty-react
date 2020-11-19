import rxAccount from "src/rx/rx-account";
import walletConnectWallet from "src/services/wallet_connect_wallet";
// const WalletConnectModal = () => {
//     useEffect(() => {
//         async function connect() {

//             const wc = new WalletConnect();
//             window.connector = await wc.connect();
//             window.web3Provider = await wc.getWeb3Provider({
//                 infuraId: "aae8b1a2cb21490294c7ab5d5123d9f8",
//               });
               
//               window.channelProvider = await wc.getChannelProvider();
//               window.eee = new providers.Web3Provider(window.web3Provider)
               
//             //   const starkwareProvider = await wc.getStarkwareProvider({
//             //     contractAddress: "<INSERT_CONTRACT_ADDRESS>",
//             //   });
//             // console.log("asas", connector)
//             const zkKeyPair = await Web3Service.getZkKeyPair(window.eee.getSigner())
//             console.log({address : window.connector.accounts[0], zkPrivateKey: zkKeyPair.zkPrivateKey, zkPublicKey: zkKeyPair.zkPublicKey, type: "walletconnect"})
//             rxAccount.import({address : window.connector.accounts[0], zkPrivateKey: zkKeyPair.zkPrivateKey, zkPublicKey: zkKeyPair.zkPublicKey, type: "walletconnect"})   
//         } 
//         connect()
//     }, [])
//     return <div>asdasdas</div>
// } 


async function connect() {
    const walletConnect = walletConnectWallet()
    const data = await walletConnect.connect()
    rxAccount.import({address : data.address, zkPrivateKey: data.zkPrivateKey, zkPublicKey: data.zkPublicKey, type: "walletconnect", wallet: walletConnect})
    walletConnect.getDisconnected(rxAccount.clear)
} 

export default () => {
    return  <button onClick={connect}>
                wallet connect
            </button>
}