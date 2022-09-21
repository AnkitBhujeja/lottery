
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useEffect, useState } from 'react';

function App() {

  // console.log(web3.version);
  // web3.eth.getAccounts().then(console.log)
  const [manager,setManager] = useState('');
  const [players,setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('')
  useEffect( () => {
    async function fetch(){
      const manager2 = await lottery.methods.manager().call();
      //while calling function we don't have to mention from:accounts[0] in javascript but in send transaction need
      const players2 = await lottery.methods.getPlayers().call();
      const balance2 = await web3.eth.getBalance(lottery.options.address);
      // web3.getBalance() gives a number but it wiill store int object manager2
      //( a number stored in library called bignumber.js )
      setManager(manager2);
      setPlayers(players2);
      setBalance(balance2);
    }
    fetch();
  },[]);

 const onSubmit = async (event)=>{
   event.preventDefault();
   // we  want to make sure form doesnot attempt to submit itself  like in classic HTML
   
   const accounts = await web3.eth.getAccounts();
   setMessage('waiting for transaction success....');
   await lottery.methods.enter().send({
     from:accounts[0],
     value: web3.utils.toWei(value,'ether')
    });
    setMessage('You have been Entered!')
  };
  
  const onClick = async() =>{
    const accounts = await web3.eth.getAccounts();
    setMessage('waiting for transaction success....');
   await lottery.methods.pickWinner().send({
     from:accounts[0]
   });
   setMessage( 'Congratulations 🎉' + await lottery.methods.winner().call() + 'has Won the Lotter!!');
   

 };
  return (
    
    <div className="App"> 
      
    <h2>Lottery Contract</h2>
    <p> This contract is managed by {manager} </p>
    <p>There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance,'ether')} ether!</p>
    <hr/>
    <form onSubmit={onSubmit}>
      <h4>Want to try your luck ?</h4>
      <div>
        <label>Amount of ether to enter</label>
        <input
        
        value={value}
         onChange={(e)=> {setValue(e.target.value) }}/>
      </div>
      <br/>
      <button>Enter</button>
    </form>

    <hr/>

    <h4>Ready to pick a Winner ?</h4>
    <button onClick={onClick}>Pick a Winner!</button>
    <hr/>

    <h2>{message}</h2>
    </div> 
  );
}

export default App;
