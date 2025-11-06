# 简单的银行DApp



## 项目描述

简单的银行DApp，使用ERC20标准，包含代币合约、银行合约，DApp前端（React）。用户可以通过前端界面进行以下操作：

- 连接钱包
- 查询银行余额（ERC20代币）
- 存钱
- 取钱
- 转账

<img src="img\简单的银行DApp.png" alt="简单的银行DApp" style="zoom:80%;" />





## 合约描述

1. ERC20Token.sol代币合约，有铸币、授权、查询余额等功能
   - 发行合约；发行人拥有初始化代币，硬编码的值
   - 授权；授权给其他地址可操作的代币数额
   - 查询；查询某个地址上该代币的数额
   - 转账函数；转账到其他地址指定数量代币
   - 高级转账函数；from和to，多了一个from参数
2. Bank.sol银行合约，有查询余额、存款、取款、转账功能

> 需要代币合约向银行合约授权充足数额的代币，银行合约才能对该数额下的代币进行操作（存款、取款）



## 开发环境

开发语言：solidity、react

钱包：metamask

solidity在线开发环境Remix（用于智能合约编写、测试与部署）：https://remix.ethereum.org/

VS Code（需要安装solidity插件、React、web3）：编写React前端

TRAE AI：字节出品的AI代码补全工具（好用）

测试网：Sepolia

> 测试区块链需要到测试水龙头领取相关ETH，用于部署开发验证

创建React工程：npx create-react-app my-bank-app



## 合约知识

代币：合约定义的数字或token，可以赋值给链上的钱包地址

同质化代币：mapping( address => 余额 )

非同质化代币：mapping( token_id => address)



## 交互时序图

<img src="img\银行DAPP时序图.png" alt="银行DAPP时序图"/>


## 参考B站仁科UP的视频

https://www.bilibili.com/video/BV15tDwYcEw8

