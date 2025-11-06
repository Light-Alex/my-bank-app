import './App.css';
import Web3 from 'web3';
import { useState, useCallback } from 'react';
import ABI from './ABI.json';

function App() {
    const [web3, setWeb3] = useState(null);
    const [address, setAddress] = useState(null);
    const [bankContract, setBankContract] = useState(null);
    const [myDeposit, setMyDeposit] = useState(null);

    // 使用useCallback优化事件处理函数
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [to, setTo] = useState('');

    // 优化输入处理函数
    const handleDepositAmountChange = useCallback((e) => {
        setDepositAmount(e.target.value);
    }, []);

    const handleWithdrawAmountChange = useCallback((e) => {
        setWithdrawAmount(e.target.value);
    }, []);

    const handleTransferAmountChange = useCallback((e) => {
        setTransferAmount(e.target.value);
    }, []);

    const handleToChange = useCallback((e) => {
        setTo(e.target.value);
    }, []);

    // 优化合约交互函数
    const getMyDeposit = useCallback(async () => {
        if (!bankContract) {
            alert('Bank contract is not connected');
            return;
        }
        try {
            const myDeposit = await bankContract.methods.myBalance().call({from: address});
            setMyDeposit(myDeposit);
        } catch (error) {
            console.error('Error getting deposit:', error);
            alert('获取余额失败');
        }
    }, [bankContract, address]);

    const deposit = useCallback(async () => {
        if (!bankContract || !depositAmount) {
            alert('请先连接钱包并输入金额');
            return;
        }
        try {
            await bankContract.methods.deposit(depositAmount).send({from: address});
            setDepositAmount('');
            await getMyDeposit(); // 更新余额显示
        } catch (error) {
            console.error('Deposit error:', error);
            alert('存款失败');
        }
    }, [bankContract, address, depositAmount, getMyDeposit]);

    const withdraw = useCallback(async () => {
        if (!bankContract || !withdrawAmount) {
            alert('请先连接钱包并输入金额');
            return;
        }
        try {
            await bankContract.methods.withdraw(withdrawAmount).send({from: address});
            setWithdrawAmount('');
            await getMyDeposit();
        } catch (error) {
            console.error('Withdraw error:', error);
            alert('取款失败');
        }
    }, [bankContract, address, withdrawAmount, getMyDeposit]);

    const transfer = useCallback(async () => {
        if (!bankContract || !transferAmount || !to) {
            alert('请填写完整信息');
            return;
        }
        try {
            await bankContract.methods.bankTransfer(to, transferAmount).send({from: address});
            setTransferAmount('');
            setTo('');
            await getMyDeposit();
        } catch (error) {
            console.error('Transfer error:', error);
            alert('转账失败');
        }
    }, [bankContract, address, transferAmount, to, getMyDeposit]);

    const connectWallet = useCallback(async () => {
        try {
            if (!window.ethereum) {
                alert('请安装MetaMask钱包');
                return;
            }
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAddress(accounts[0]);
            
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            
            const contract = new web3Instance.eth.Contract(ABI, '0x6b61b50e7fe9dabad97431c57a7242db8eb8be2e');
            setBankContract(contract);
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert('钱包连接失败');
        }
    }, []);

    return (
        <div className="App" style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>PT BANK</h1>
                <button 
                    onClick={connectWallet}
                    style={{ 
                        padding: '10px 10px', 
                        marginBottom: '5px',
                        cursor: 'pointer'
                    }}
                >
                    连接钱包
                </button>
                
                {address && (
                    <div style={{ marginBottom: '10px' }}>
                        <h3>账户地址: {address}</h3>
                    </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                    <p>
                        银行余额: {myDeposit} 
                        <button 
                            onClick={getMyDeposit}
                            style={{ marginLeft: '10px', padding: '5px 10px' }}
                        >
                            查询
                        </button>
                    </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <input 
                        value={depositAmount}
                        onChange={handleDepositAmountChange}
                        type="number"
                        placeholder="存款金额"
                        style={{ 
                            padding: '8px', 
                            marginRight: '10px',
                            width: '150px'
                        }}
                    />
                    <button 
                        onClick={deposit}
                        style={{ padding: '8px 15px' }}
                    >
                        存款
                    </button>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <input 
                        value={withdrawAmount}
                        onChange={handleWithdrawAmountChange}
                        type="number"
                        placeholder="取款金额"
                        style={{ 
                            padding: '8px', 
                            marginRight: '10px',
                            width: '150px'
                        }}
                    />
                    <button 
                        onClick={withdraw}
                        style={{ padding: '8px 15px' }}
                    >
                        取款
                    </button>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            value={to}
                            onChange={handleToChange}
                            type="text"
                            placeholder="转账地址"
                            style={{ 
                                padding: '8px', 
                                width: '220px'
                            }}
                        />
                    </div>

                    <div>
                        <input 
                            value={transferAmount}
                            onChange={handleTransferAmountChange}
                            type="number"
                            placeholder="转账金额"
                            style={{ 
                                padding: '8px', 
                                marginRight: '10px',
                                width: '150px'
                            }}
                        />
                        <button 
                            onClick={transfer}
                            style={{ padding: '8px 15px' }}
                        >
                            转账
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
