import ENV from "../configs/env";
import Web3 from "web3";
import * as ethereumjs from 'ethereumjs-util'
import { toBigAmount, toGwei, toHex, toWei } from "../utils/converters";
import { getBiggestNumber } from "src/utils/fortmaters";


const web3 = new Web3(new Web3.providers.HttpProvider(ENV.NODE.URL, ENV.NODE.CONNECTION_TIMEOUT))
const l2Contract = new web3.eth.Contract(ENV.ABI.L2)
const erc20Contract = new web3.eth.Contract(ENV.ABI.ERC20)

const getTxObject = (contractAddress, methodData, address, value = "0x0", gasPrice = null, gas = null) => {
    let txObject = {
        from: address,
        to: contractAddress,
        value: value,
        data: methodData
    }
    if (gasPrice !== null) txObject.gasPrice = toHex(toWei(gasPrice));
    if (gas !== null) txObject.gas = toHex(gas);
    return txObject
}

export default {
    getAccountID: (pubKey) => {
      console.log(ENV.CONTRACTS.L2)
        return new Promise((resolve, reject) => {
          const data = l2Contract.methods.pubKeyToAccountData(pubKey).encodeABI();
          web3.eth
            .call({
              to: ENV.CONTRACTS.L2,
              data: data,
            })
            .then((result) => {
              const idData = web3.eth.abi.decodeParameters(["bool", "uint32"], result)
              resolve(parseInt(idData[1]));
            })
            .catch((err) => {
              reject(err);
            });
        });
    },
    fetchTokenBalance: (address, tokenAddress) => {
      let tokenContract = erc20Contract;
      tokenContract.options.address = tokenAddress;
      return new Promise((resolve, reject) => { 
        const data = tokenContract.methods.balanceOf(address).encodeABI();
        web3.eth
        .call({
          to: tokenAddress,
          data: data,
        })
        .then((result) => {
          const tokenBalance = web3.eth.abi.decodeParameters(["uint256"], result);
          resolve(tokenBalance[0]);
        })
        .catch((err) => {
          reject(err);
        });
      })

    }, 
    fetchTokenAllowance: (address, tokenAddress, delegator = ENV.CONTRACTS.L2) => {
        let tokenContract = erc20Contract;
        tokenContract.options.address = tokenAddress;
        const data = tokenContract.methods.allowance(address, delegator).encodeABI();
        return new Promise((resolve, reject) => {
          web3.eth.call({
                to: tokenAddress,
                data: data
            }).then(result => {
                const allowance = web3.eth.abi.decodeParameters(['uint256'], result);
                resolve(allowance[0])
            }).catch((err) => {
                reject(err)
            })
        })
    },
    getDepositTxObject: (address, accountID, tokenAddress, amount, gasPrice = null, gas = null) => {
        const data = l2Contract.methods.deposit(accountID, tokenAddress, toHex(toBigAmount(amount))).encodeABI();
        let ethValue;
        if (tokenAddress == ENV.TOKENS.ETH.address) {
          ethValue = toHex(toBigAmount(amount));
        }
        return (gasPrice = null, gas = null) => getTxObject(ENV.CONTRACTS.L2, data, address, ethValue, gasPrice, gas)
    },
    getApproveTxObject: ( address, isApproveToMax = true, tokenAddress, delegator = ENV.CONTRACTS.L2) => {
      const allowanceAmount = isApproveToMax ? getBiggestNumber() : 0;
      const tokenContract = erc20Contract;
      tokenContract.options.address = tokenAddress;
  
      const approveData = tokenContract.methods.approve(delegator, allowanceAmount).encodeABI();
      return (gasPrice = null, gas = null) => getTxObject(tokenAddress, approveData, address, null, gasPrice, gas)
    },
    checkTxMined: async (txHash, topic = null) => {
        const receipt = await web3.eth.getTransactionReceipt(txHash)
        if (receipt !== null) {
            if (!topic) {
              return receipt.status;
            }
            const logs = receipt.logs;
            const blockNumber = receipt.blockNumber;
      
            if (!blockNumber) {
              return null;
            }
            if (!logs.length) {
              return false;
            }
      
            for (let i = 0; i < logs.length; ++i) {
              if (logs[i].topics[0].toLowerCase() === topic.toLowerCase()) {
                return true;
              }
            }
        }
        return null;
    },
    // makeTransaction: async (txObject, privateKey, devicePath) => {
    //   try {
    //       let txHash;
    //       if (privateKey) {
            
    //         const signedTxObj = await signTransaction(txObject, privateKey);
    //         txHash = await sendSignedTransaction(signedTxObj.rawTransaction);
    //       } else if (devicePath) {
    //         const signedRawTx = await signTransaction(txObject, devicePath);
    //         txHash = await sendSignedTransaction(signedRawTx);
    //       } else {
    //         txHash = await sendTransaction(txObject);
    //       }
    //       return txHash;
    //     } catch (error) {
    //       return Promise.reject(error);
    //     }
    // },
    estimateGas: async (txObject, type) => {
      return await new Promise((resolve, reject) => {
        web3.eth.estimateGas(txObject)
        .then((result) => resolve(Math.round(result * 1.3)))
        .catch((err) => {
          reject(Math.round(ENV.DEFAULT_GAS[type] * 1.3))
        })
      })
    },
    getZkKeyPair:  async (ethSigner) => {
      try { 
        const zkSigner = await window.zksync.Signer.fromETHSignature(ethSigner);
        let privKeyBuffer = zkSigner.signer.privateKey;
        let privKey = ethereumjs.bufferToHex(Array.from(privKeyBuffer))
    
        let pubKeyBuff = window.zksyncCrypto.private_key_to_pubkey(privKeyBuffer)
        let publicKey = ethereumjs.bufferToHex(Array.from(pubKeyBuff))
        return {zkPrivateKey: privKey, zkPublicKey: publicKey} 
      }
      catch(e) {
        alert(e)
      }
      return {}
  } 
}