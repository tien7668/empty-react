import './App.css';
import rxAccount from 'src/rx/rx-account'
import ModalContainer from 'src/components/modals/modal_container';

import Deposit from 'src/components/deposit/deposit';

import { useEffect } from 'react'
import useFetchingInitData from './components/hooks/useFetchingInitData';
import rxCurrency from './rx/rx-currency';
import MetamaskButton from 'src/components/account/metamask_button'
import PrivateKeyButton from 'src/components/account/private_key_button'
import WalletConnectButton from 'src/components/account/wallet_connect_button'
function App() {
  const account = rxAccount.useAccount()
  const currency = rxCurrency.useCurrency()
  console.log("----", account, currency)
  useFetchingInitData()

  useEffect(() => {
    loadWasm();
  }, [])
  return (
    <div className="App">
      {
        !account.address ? (
                            <>
                              <MetamaskButton />
                              <PrivateKeyButton />
                              <WalletConnectButton />
                            </>
                          ) : (
                            <>
                              <button onClick={() => rxAccount.clear()}>
                                clear account
                              </button>

                              Your address: {account.address}
                              <Deposit />
                            </>
                          )
      }
      <ModalContainer />
    </div>
  );
}


async function loadWasm() {
  try {
    const zksyncCrypto = await import('zksync-crypto');
    const zksync = await import('zksync');
    window.zksync = zksync
    window.zksyncCrypto = zksyncCrypto
    // genTestKeyPairs()
  } catch(err) {
    console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
  }
};

export default App;
