// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Bank {
    // mapping(address => uint)
    mapping(address => uint) public deposited;

    // 静态变量
    address public immutable token;

    constructor(address _token) {
        token = _token;
    }

    modifier requireBlalance(uint amount) {
        amount *= 10 ** 18;
        uint balance = deposited[msg.sender];
        require(amount <= balance, "the amount more than bank of balance!");
        _; // 填充业务代码
    }

    // query my balance
    function myBalance() public view returns(uint balance) {
        balance = deposited[msg.sender] / (10 ** 18);
        // return deposited[msg.sender];
    }

    // deposit 存款
    function deposit(uint amount) public {
        amount *= 10 ** 18;
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "transfer error!");

        deposited[msg.sender] += amount;

    }

    // 取款 withdraw（从银行合约中取款到钱包）
    function withdraw(uint amount) external requireBlalance(amount) {
        amount *= 10 ** 18;
        // require(amount <= deposited[msg.sender], "the amount more than bank of balance!");

        // require(IERC20(token).transfer(msg.sender, amount), "transfer error!");
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
        deposited[msg.sender] -= amount;
    }

    // 转账 transfer（银行合约之间转，所以不涉及到交易（和钱包交互））
    function bankTransfer(address to, uint amount) public requireBlalance(amount) {
        amount *= 10 ** 18;
        // require(amount <= deposited[msg.sender], "the amount more than bank of balance!");
        deposited[msg.sender] -= amount;
        deposited[to] += amount;
    }
}