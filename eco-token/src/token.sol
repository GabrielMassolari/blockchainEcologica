// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IERC20 {
  function totalSupply() external view returns(uint256);
  function balanceOf(address account) external view returns(uint256);
  function transfer(address to, uint256 quantity) external returns(bool);
  function getTransactionCount(address account) external view returns(uint256);
  function getTransaction(address account, uint256 index) external view returns(address from, address to, uint256 value, uint256 blockNumber);
  function getTotalTransferred(address account) external view returns(uint256);
  function getTotalReceived(address account) external view returns(uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract CryptoToken is IERC20 {

  //Properties
  string public constant name = "ECOTOKEN";
  string public constant symbol = "ECTK";
  uint8 public constant decimals = 18;
  uint256 private totalsupply;

  mapping(address => uint256) private addressToBalance;
  mapping(address => uint256) private transactionCounts;
  mapping(address => mapping(uint256 => TransferStruct)) private transactionHistory;
  mapping(address => uint256) private totalReceived;
  mapping(address => uint256) private totalTransferred;

  struct TransferStruct {
    address from;
    address to;
    uint256 value;
    uint256 blockNumber;
  }

  //Constructor
  constructor(uint256 total) {
    totalsupply = total;
    addressToBalance[msg.sender] = totalsupply;
  }

  //Public Functions
  function totalSupply() public override view returns(uint256) {
    return totalsupply;
  }

  function balanceOf(address account) public override view returns(uint256) {
    return addressToBalance[account];
  }

  function transfer(address to, uint256 quantity) public override returns(bool) {
    require(addressToBalance[msg.sender] >= quantity, "Insufficient Balance to Transfer");

    addressToBalance[msg.sender] -= quantity;
    addressToBalance[to] += quantity;

    totalTransferred[msg.sender] += quantity;
    totalReceived[to] += quantity;

    uint256 senderTransactionCount = transactionCounts[msg.sender]++;
    transactionHistory[msg.sender][senderTransactionCount] = TransferStruct({
      from: msg.sender,
      to: to,
      value: quantity,
      blockNumber: block.number
    });

    uint256 receiverTransactionCount = transactionCounts[to]++;
    transactionHistory[to][receiverTransactionCount] = TransferStruct({
      from: msg.sender,
      to: to,
      value: quantity,
      blockNumber: block.number
    });

    emit Transfer(msg.sender, to, quantity);
    return true;
  }

  function getTransactionCount(address account) public override view returns(uint256) {
    return transactionCounts[account];
  }

  function getTransaction(address account, uint256 index) public override view returns(address, address, uint256, uint256) {
    require(index < transactionCounts[account], "Transaction does not exist.");
    TransferStruct memory transaction = transactionHistory[account][index];
    return (transaction.from, transaction.to, transaction.value, transaction.blockNumber);
  }

   function getTotalTransferred(address account) public view returns(uint256) {
        return totalTransferred[account];
    }

    function getTotalReceived(address account) public view returns(uint256) {
        return totalReceived[account];
    }
}