import { useState, useEffect } from 'react'
import web3Service from "src/services/web3_service";
import { calculateTxFee } from "src/utils/calculators";

export default ({txObject, type}) => {
    const [gasPrice, setGasPrice] = useState(20);
    const [gas, setGas] = useState(null);
    const [txFee, setTxFee] = useState(null);
    useEffect(() => {
        async function fetchGasAndTxFee() {
            const estimatedGasLimit = await web3Service.estimateGas(txObject, type)
            const txFee = calculateTxFee(gasPrice, estimatedGasLimit);
            setGasPrice(gasPrice);
            setGas(estimatedGasLimit);
            setTxFee(txFee);
        } 
        fetchGasAndTxFee()
    }, [])

    return { gasPrice, gas, txFee}
} 