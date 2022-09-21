import Web3 from "web3";

let web3;
const ethEnabled = async () => {
    if (window.ethereum) {      
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    
  }
ethEnabled();
console.log(web3);
export default web3;