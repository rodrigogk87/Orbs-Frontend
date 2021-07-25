import logo from './logo.svg';
import './App.css';
import React,{ useState,useEffect }  from 'react';
import OrbBirth from './OrbBirth';
import OrbsList from './OrbsList';
import Orbs from './contracts/Orbs.json';
import { getWeb3 } from './utils.js';

//https://en.wikipedia.org/wiki/Scientific_pitch_notation
function App() {

  
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [loading, setLoading ] = useState(true);
  const [networkId, setNetworkId] = useState(undefined);
  const [orbs, setOrbs] = useState([]);
  const [error, setError ] = useState(false);

  useEffect(() => {
    const init = async () => {
      try{
        const web3 = await getWeb3();
        
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);
        
        const deployedNetwork = Orbs.networks[networkId];
        const contract = new web3.eth.Contract(
          Orbs.abi,
          deployedNetwork && deployedNetwork.address,
        );
        
        const orbsResult = await contract.methods.getOrbs().call();
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        setOrbs(orbsResult);
        setLoading(false);
        console.log(orbs);
      }
      catch(e){
          setError(e);
          setLoading(false);
      }
     
    }
    init();
    
    if(web3){
      window.ethereum.on('accountsChanged', accounts => {
        console.log('changed',accounts);
        if(accounts.length == 0){
          window.location.reload();
        }
        setAccounts(accounts);
      });
    }

  }, []);






  return (
    <div className="App">
      <header className="App-header">
        {!web3 ?
          <>
            
            <OrbBirth/>
          </>     
          :
          <></>
          }
      </header>
    </div>
  );
}

export default App;
