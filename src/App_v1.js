import './App.css';
import Web3 from 'web3';
import { useState} from 'react';
import ABI from './ABI.json';


/**
 * 银行DApp主组件
 * 这是一个基于React的Web3银行应用，提供钱包连接和银行合约交互功能
 */
function App() {

    // React状态管理
    const [web3, setWeb3] = useState(null); // Web3实例状态
    const [address, setAddress] = useState(null); // 用户钱包地址状态
    const [bankContract, setBankContract] = useState(null); // 银行合约实例状态
    const [myDeposit, setMyDeposit] = useState(null); // 用户存款余额状态

    // const [number, setNumber] = useState(null); // 存款金额状态
    // // 获取前端输入的存款金额
    // const newNumber = (e) => {
    //     setNumber(e.target.value);
    // }

    // 为每个输入框创建独立的状态
    const [depositAmount, setDepositAmount] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState(null);
    const [transferAmount, setTransferAmount] = useState(null);
    const [to, setTo] = useState(null); // 转账目标地址状态

    // 独立的处理函数
    const handleDepositAmountChange = (e) => {
        setDepositAmount(e.target.value);
    }

    const handleWithdrawAmountChange = (e) => {
        setWithdrawAmount(e.target.value);
    }

    const handleTransferAmountChange = (e) => {
        setTransferAmount(e.target.value);
    }

    // 获取前端输入的转账目标地址
    const newAddress = (e) => {
        setTo(e.target.value);
    }

    // 获取用户存款余额
    const getMyDeposit = async () => {
        if (!bankContract) {
            console.log('Bank contract is not connected');
            alert('Bank contract is not connected');
            return;
        }

        // 调用合约方法获取查询余额，查看链上数据而不修改的话用call
        const myDeposit = await bankContract.methods.myBalance().call({from: address});
        // 将余额更新到状态中，触发组件重新渲染
        setMyDeposit(myDeposit);
    }

    // 进行存款
    const deposit = async () => {
        // 调用合约方法进行存款，修改链上数据用send
        await bankContract.methods.deposit(depositAmount).send({from: address});
    }

    // 进行取款
    const withdraw = async () => {
        // 调用合约方法进行取款，修改链上数据用send
        await bankContract.methods.withdraw(withdrawAmount).send({from: address});
    }

     // 进行转账
    const transfer = async () => {
        // 调用合约方法进行转账，修改链上数据用send
        await bankContract.methods.bankTransfer(to, transferAmount).send({from: address});
    }


     /**
     * 连接Web3钱包并初始化合约
     * 这是一个异步函数，负责整个DApp的初始化流程
     */
    const connectWallet = async () => {
        // 1. 获取钱包账户对象
        // 通过MetaMask等钱包提供商的API获取用户账户列表
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // 将第一个账户地址（通常是主账户）设置到状态中
        setAddress(accounts[0]);

        // 2. 连接web3
        // 创建新的Web3实例，使用钱包提供的provider
        const web3 = new Web3(window.web3.currentProvider);
        // 将Web3实例保存到状态中，供后续使用
        setWeb3(web3);

        // 3. 获取智能合约 ABI + address
        // 使用ABI和合约地址创建合约实例
        // ABI定义了合约的方法接口，地址指定了部署的合约位置
        const bankContract = new web3.eth.Contract(ABI, '0x6b61b50e7fe9dabad97431c57a7242db8eb8be2e'); // 替换成自己的银行合约
        // 将合约实例保存到状态中，用于后续的合约交互
        setBankContract(bankContract);
    }

    return (
        <body className="body" style={{height: '100vh'}}>
            <div className="App bg-img">
                <div className="card">
                    <h1 className="h1">REN KE BANK</h1>
                    <button className='button' onClick={connectWallet}>connnect wallet</button>
                    <h3 className="h3">账户地址-Address: {address}</h3>
                    
                    <section>
                        <div>
                        <p className="h3">银行余额：{myDeposit} <button onClick={getMyDeposit}>查询</button> </p>
                        </div>
                    </section>

                    <section>
                        <div>
                        <p className="h3">金额：<input className="input" onChange={handleDepositAmountChange} type='number'/>
                        <button onClick={deposit}>存款</button></p>
                        </div>
                    </section>

                    <section>
                        <div>
                            <p className="h3">金额：<input className="input" onChange={handleWithdrawAmountChange} type='number'/>
                            <button onClick={withdraw}>取款</button></p>
                        </div>
                    </section>

                    <section>
                        <div>
                            <p className="p1">转账地址：<input className="input" onChange={newAddress} type='text'/></p>
                            <p className="p2">转账金额：<input className="input" onChange={handleTransferAmountChange} type='number'/><button onClick={transfer}>转账</button></p>
                        </div>
                    </section>
                </div>
            </div>
        </body>
    );
}

export default App;
