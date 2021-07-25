import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

const getWeb3 = () =>
  new Promise( async (resolve, reject) => {
      let provider = await detectEthereumProvider();
      
      
      if(provider) {
        await provider.request({ method: 'eth_requestAccounts' }); 
        try {
          const web3 = new Web3(window.ethereum);
          resolve(web3);
        } catch(error) {
          reject(error);
        }
      }
    
  });

export { getWeb3 }; 