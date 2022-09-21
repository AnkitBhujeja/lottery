const assert = require('assert');
// standarad library -> making assertion about test so we may assert some value equal to another value
const ganache = require('ganache-cli');
const Web3 =require('web3');
//Web3 is a constructor function it is used to create instanace of web3 library by tradiition
const web3  = new Web3(ganache.provider());
// create an instance of web3 library and tell that instance to attempt to connect to this local test network 
//that we are hosting on our machine solely for this purpose of running instance
const {interface,bytecode} = require('../compile')

let accounts,lottery;
beforeEach(async ()=>{
    // get a list of all accounts
   accounts = await web3.eth.getAccounts()

        /*
        this is replaced by async await syntax
        .then((fetchedAccounts)=>{                        
            console.log(fetchedAccounts);
        })   

        */
   // .eth i a module in web3 library and every function is asynchronous

    //Use one of those account to deploy the contract
      lottery = await new web3.eth.Contract(JSON.parse(interface))  // javasript representation of our contract
        .deploy({data:bytecode})
        .send({from:accounts[0],gas:'1000000'})
});


describe('Lottery contract',()=>{
    it('deploys a contract',()=>{
        // console.log(accounts);
        // console.log(inbox);
        assert.ok(lottery.options.address);
        //check address is a defined value or not
    });
    it('enter only one account',async ()=>{
         await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from:accounts[0]}
            );
        assert.equal(players[0],accounts[0]);
        assert.equal(1,players.length);
    });
    it('multiple accounts can enter', async ()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from:accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from:accounts[2],
            value: web3.utils.toWei('0.02','ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from:accounts[0]}
            );
        assert.equal(players[0],accounts[0]);
        assert.equal(players[1],accounts[1]);
        assert.equal(players[2],accounts[2]);
        assert.equal(3,players.length);
    });

    it('requires minimum 0.01 ether',async ()=>{
        try{
        await lottery.methods.enter().send({
           from:accounts[0],
           value: 30 //way by default so error arises

       });
       assert(false);
     }catch(err){
         assert(err);
     }
    });
    
    it('only manager can all pickWinner function',async ()=>{
       try{
        await lottery.methods.pickWinner().send({
            from:accounts[1]
        });
        assert(false);
       }catch(err){
           assert(err);
       }
    });

    it('sends money to winner(manager) and reset players array', async ()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('2','ether') //way by default so error arises

        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from:accounts[0]
        })
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        //we have to pay some amount of money in form of gas for processing the transaction
        // so differenc b/w final and initial is just less than 2
        const difference = finalBalance-initialBalance;
        assert(difference>web3.utils.toWei('1.9','ether'));
        assert(difference<web3.utils.toWei('2','ether'));
        assert(lottery.methods.players.length==0); //reset players array or not

    });
    it('sends money to winner(some other) and reset players array and ', async ()=>{
        await lottery.methods.enter().send({
            from:accounts[1],
            value: web3.utils.toWei('2','ether') //way by default so error arises

        });
        const initialBalance = await web3.eth.getBalance(accounts[1]);
        await lottery.methods.pickWinner().send({
            from:accounts[0]
        })
        const finalBalance = await web3.eth.getBalance(accounts[1]);
        //we have to pay some amount of money in form of gas for processing the transaction
        // so differenc b/w final and initial is just less than 2
        const difference = finalBalance-initialBalance;
        assert(difference==web3.utils.toWei('2','ether'));
        assert(lottery.methods.players.length==0);
  
    
    });
})




/*

// --------------------Example of mocha practice--------------------------------
class Car{
    park(){
        return "stopped";
    }
    drive(){
        return "vroom";
    }
}


let car;  //global variabble
beforeEach(()=>{
    // const car = new Car();
    car =new Car();
})
//it will execute every time before the it statement.
// but scope problem car is defined only under beforeEach(); so we go for global declaration
describe('Car',()=>{
    it('can park',()=>{
        // const car = new Car();
        assert.equal(car.park(),'stopped');
    })
    it('can drive',()=>{
        // const car = new Car();
        assert.equal(car.drive(),'vroom');
    })
})
// first argument -String not the name of Car class , this can be anything (used only for organizational purpose)
//Second argument - arrow function conatin alll other different it statements 

*/



