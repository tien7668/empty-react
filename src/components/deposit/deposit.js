
import {useState, useEffect} from 'react'
import rxAccount from '../../rx/rx-account';
import Web3Service from '../../services/web3_service'
import modalService from '../../services/single_modal_service'
import rxCurrency from 'src/rx/rx-currency';
import { toBigAmount } from "src/utils/converters";
import { compareTwoNumber } from "src/utils/calculators";
import useGasAndTxFee from '../hooks/useGasAndTxFee';
import ENV from 'src/configs/env';
export default function() {
    // const [currency] = useState({address: "0xc9b8548f0fdc231bdc08b74f5ac888677a15d620", balance: 0});
    const currency = rxCurrency.useCurrency().data[0]
    const [amount, setAmount] = useState(0)
    const account = rxAccount.useAccount()

    const [flow, setFlow] = useState([])

    async function deposit(){
        const tokenAllowance = await Web3Service.fetchTokenAllowance(account.address, currency.address);
        if (+tokenAllowance <= 0 ) { //start deposit immediatly
            setFlow([
                {component: ApproveModal, props: {currency, isApproveToMax: true}},
                {component: BroadcastModal}, 
                {component: ConfirmModal, props: {amount, currency}}, 
                {component: BroadcastModal}, 
                {component: DoneModal, props: {}}
            ])
        }else if (compareTwoNumber(tokenAllowance, toBigAmount(amount)) === -1) {
            setFlow([
                {component: ApproveModal, props: {currency, isApproveToMax: false}},
                {component: BroadcastModal}, 
                {component: ApproveModal, props: {currency, isApproveToMax: true}},
                {component: BroadcastModal}, 
                {component: ConfirmModal, props: {amount, currency}}, 
                {component: BroadcastModal}, 
                {component: DoneModal, props: {}}
            ])
        }else {
            setFlow([
                {component: ConfirmModal, props: {amount, currency}}, 
                {component: BroadcastModal}, 
                {component: DoneModal, props: {}}
            ])
        }  
    }

    return(
        <>
            <input onChange={(e) => setAmount(e.target.value)}></input>
            <button onClick={deposit}>Deposit</button>
            balance: {currency.balance}
            <StepWizard 
                flow={flow} 
                cancelFlow={() => {setFlow([])}}/>
        </>
    ) 
}

const StepWizard = ({flow, cancelFlow}) => {
    const [step, setStep] = useState(0)
    useEffect(() => {
        if (flow.length == 0) { setStep(0) ; modalService.show(""); return}
        if (step >= flow.length) cancelFlow()
        else {
            const M = flow[step].component
            modalService.show(<M nextStep={() => setStep(s => s + 1)} cancelFlow={cancelFlow} {...flow[step].props}/>, cancelFlow)
        } 
    }, [step, flow])
    return <></>
}  



const ApproveModal = ({nextStep, cancelFlow, currency, isApproveToMax}) => {
    const account = rxAccount.useAccount()
    const getApproveTxObject = Web3Service.getApproveTxObject(account.address, isApproveToMax, currency.address);
    const { gasPrice, gas } = useGasAndTxFee({txObject: getApproveTxObject(), type: ENV.STEPS.APPROVE}) 
    
    const approve = async () => {
        const txHash = await account.wallet.makeTransaction(getApproveTxObject(gasPrice, gas), account.privateKey, account.devicePath);
        rxAccount.setTxHash(txHash)
        nextStep()
    }
    return <div> approve to {isApproveToMax ? "max" : "0" } step <button onClick={approve}>next</button><button onClick={cancelFlow}>cancel</button></div>
} 

const ConfirmModal = ({nextStep, cancelFlow, amount, currency}) => {
    const account = rxAccount.useAccount()
    const getDepositTxObject = Web3Service.getDepositTxObject(account.address, account.id, currency.address, amount)
    const { gasPrice, gas } = useGasAndTxFee({txObject: getDepositTxObject(), type: ENV.STEPS.DEPOSIT}) 
    async function deposit() {
        const txHash = await account.wallet.makeTransaction(getDepositTxObject(gasPrice, gas), account.privateKey, account.devicePath);
        rxAccount.setTxHash(txHash)
        nextStep()
    }
    return <div> deposit step <button onClick={deposit}>next</button><button onClick={cancelFlow}>cancel</button></div>
} 


const BroadcastModal = ({nextStep, cancelFlow}) => {
    const account = rxAccount.useAccount()
    useEffect(() => {
        const interval = setInterval(() => {
            Web3Service.checkTxMined(account.txHash).then((isMined) => {
                if (isMined !== null) {
                    clearInterval(interval);
                    if (isMined) {
                      alert("mined")
                      return;
                    }
                    alert("error")
                }
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    return <div> broadcast step 
        txhash:{account.txHash}<button onClick={nextStep}>next</button><button onClick={cancelFlow}>cancel</button></div>
} 

const DoneModal = ({nextStep, cancelFlow}) => {
    return <div> done step  <button onClick={nextStep}>next</button><button onClick={cancelFlow}>cancel</button> </div>
} 