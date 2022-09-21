const path = require('path');
const fs =require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname,'contracts','Lottery.sol');
// we using these so that hame aise path mile jo window aur linux dono me depend kre aur chle
// instead of require('../contracts/Inbox') ye direct content ko execute krta hai
// jbki hmara content solidity hai to ye erro dga ki not a javascript file.

const source = fs.readFileSync(lotteryPath,'utf-8');
// console.log(solc.compile(source,1));
// solce.compile(file_content,no. of different contarcts);
// returns an object

module.exports = solc.compile(source,1).contracts[':Lottery'];
// accessing compiled code immediately from compile.js, returning objects  only contracts with Inbox name 