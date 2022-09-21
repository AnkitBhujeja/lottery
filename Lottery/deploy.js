const HDWALLETPROVIDER =require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {interface,bytecode} = require('./compile')
// https://rinkeby.infura.io/v3/bbe44fcefca64bc78119a21c5980a74e
// bbe44fcefca64bc78119a21c5980a74e
const provider = new HDWALLETPROVIDER(
 "spot repair crop diesel will lava system spoil sponsor pitch tired borrow",
   'https://rinkeby.infura.io/v3/bbe44fcefca64bc78119a21c5980a74e'
  
    );

  const web3 = new Web3(provider); 

  const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account',accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
       .deploy({data:  bytecode}) // add 0x bytecode
       .send({from: accounts[0],gas:'1000000'}); // remove 'gas'
      
      console.log(interface);
    console.log('contract deployed to ', result.options.address); 
  }
  provider.engine.stop();
  deploy();