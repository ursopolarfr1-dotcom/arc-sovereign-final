// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SovereignVault {
    struct UserAccount {
        uint256 balance;
        uint256 lockedBalance;
        uint256 unlockTime;
        address guardian;
        uint256 lastActivity;
    }

    mapping(address => UserAccount) public accounts;
    uint256 public constant YIELD_RATE = 5; // 5% APY Simbolizado

    function deposit() public payable {
        accounts[msg.sender].balance += msg.value;
        accounts[msg.sender].lastActivity = block.timestamp;
    }

    function withdraw(uint256 _amount) public {
        require(accounts[msg.sender].balance >= _amount, "Saldo insuficiente");
        accounts[msg.sender].balance -= _amount;
        accounts[msg.sender].lastActivity = block.timestamp;
        payable(msg.sender).transfer(_amount);
    }

    function setGuardian(address _guardian) public {
        accounts[msg.sender].guardian = _guardian;
        accounts[msg.sender].lastActivity = block.timestamp;
    }

    // Função para simular o Yield Lock
    function lockFunds(uint256 _duration) public payable {
        accounts[msg.sender].lockedBalance += msg.value;
        accounts[msg.sender].unlockTime = block.timestamp + _duration;
        accounts[msg.sender].lastActivity = block.timestamp;
    }
}
