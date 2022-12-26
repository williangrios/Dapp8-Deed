import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import {  useState, useEffect } from 'react';
import { ethers } from "ethers";
import {ToastContainer, toast} from "react-toastify";

import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter, { async } from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import Button from "react-bootstrap/Button";

import { format6FirstsAnd6LastsChar } from "./utils";
import meta from "./assets/metamask.png";

function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  const [addressLawyer, setAddressLawyer] = useState('');
  const [addressBeneficiary, setAddressBeneficiary] = useState('');
  const [fromNow, setFromNow] = useState(0);
  const [balance, setBalance] = useState(0);

  const contractAddress = '0xDDaC774e20e83a2ffe7933c0623673893fBD7A46';

  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_lawyer",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "_beneficiary",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "fromNow",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor",
      "payable": true
    },
    {
      "inputs": [],
      "name": "beneficiary",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "earliest",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "lawyer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  
  async function handleConnectWallet (){
    try {
      setLoading(true)
      let prov =  new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);

      let userAcc = await prov.send('eth_requestAccounts', []);
      setUser({account: userAcc[0], connected: true});

      const contrSig = new ethers.Contract(contractAddress, abi, prov.getSigner())
      setSigner( contrSig)
      loadContractData(contrSig);
    } catch (error) {
      toastMessage(error.reason)
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    
    async function getData() {
      try {
        const {ethereum} = window;
        if (!ethereum){
          toastMessage('Metamask not detected');
        }
  
        const goerliChainId = "0x5";
        const currentChainId = await window.ethereum.request({method: 'eth_chainId'})
        if (goerliChainId != currentChainId){
          toastMessage('Change to goerli testnet')
        }    

      } catch (error) {
        toastMessage(error.reason)        
      }
      
    }

    getData()  
    
  }, [])
  
  async function isConnected(){
    if (!user.connected){
      toastMessage('You are not connected!')
      return false;
    }
    return true;
  }

  async function handleDisconnect(){
    try {
      setUser({});
      setSigner(null);
      setProvider(null);
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }


  async function handleWithdraw(){
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp  = await signer.withdraw();  
      await resp.wait();
      toastMessage('Withdrawn');
    } catch (error) {
      toastMessage(error.reason);
    } finally{
      setLoading(false);
    }
  }

  async function loadContractData(sig){
    let balanceOf = await sig.balanceOf();
    setBalance(balanceOf);
    setAddressLawyer(await  sig.lawyer());
    setAddressBeneficiary( await sig.beneficiary());
    let resp = await sig.earliest() * 1000;
    let date = new Date(resp);
    let dateFormatted = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes();
    setFromNow(dateFormatted)
    toastMessage('load')
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Deed" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
        <h1>DEED</h1>

        {loading && 
          <h1>Loading....</h1>
        }
        { !user.connected ?<>
            <Button className="commands" variant="btn btn-primary" onClick={handleConnectWallet}>
              <img src={meta} alt="metamask" width="30px" height="30px"/>Connect to Metamask
            </Button></>
          : <>
            <label>Welcome {format6FirstsAnd6LastsChar(user.account)}</label>
            <button className="btn btn-primary commands" onClick={handleDisconnect}>Disconnect</button>
          </>
        }
        <hr/> 

        <h2>Deed Info</h2>
        <label>Balance: {(balance).toString()} wei</label>
        <label>When free: {(fromNow).toString()}</label>
        <label>Lawyer address: {addressLawyer}</label>
        <label>Beneficiary address: {addressBeneficiary}</label>
        <hr/>
        <h2>Withdraw Funds</h2>
        <button className="btn btn-primary commands" onClick={handleWithdraw}>Withdraw</button>
        
      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />  
    </div>
  );
}

export default App;
