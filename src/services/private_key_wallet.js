import ENV from "../configs/env";
import Web3 from "web3";
const web3 = new Web3(new Web3.providers.HttpProvider(ENV.NODE.URL, ENV.NODE.CONNECTION_TIMEOUT));
const signTransaction = (txObject, privateKey) => {
    return new Promise((resolve, reject) => {
      web3.eth.accounts.signTransaction(txObject, privateKey, function (err, signedTxObj) {
        if (!err) {
          resolve(signedTxObj);
        } else {
          reject(err.message);
        }
      });
    });
  };

const sendSignedTransaction = (rawTx) => {
    return new Promise((resolve, reject) => {
      web3.eth.sendSignedTransaction(rawTx, function (err, txHash) {
        if (!err) {
          resolve(txHash);
        } else {
          reject(err.message);
        }
      });
    });
  };
export default (state = {}) => {
    return {
        makeTransaction: async (txObject, privateKey) => {
            const signedTxObj = await signTransaction(txObject, privateKey);
            let txHash = await sendSignedTransaction(signedTxObj.rawTransaction);
            return txHash
        } 
    }
} 