import React from 'react';
import './index.css';
import { FaLeaf, FaRegMoneyBillAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Web3 from 'web3';

function Home() {
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transacoesRecentes, setTransacoesRecentes] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  // Substitua pelo endereço do seu contrato implantado
  const contractAddress = '0x68479035e76b0d2c6d3e591936b08a64afda9e5e';
  const contractABIString =  JSON.parse(`
  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "total",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getTotalReceived",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getTotalTransferred",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getTransaction",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getTransactionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  `)

  const [inputs, setInputs] = useState({
    quantia: '',
    carteira: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  useEffect(() => {
    // Inicializar web3 e o contrato
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const tokenContract = new web3Instance.eth.Contract(contractABIString, contractAddress);
      setContract(tokenContract);

      // Solicitar acesso às contas
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accs => setAccounts(accs));
    }
  }, []);

  // Obter o saldo quando as contas estiverem disponíveis
  useEffect(() => {
    if (web3 && contract && accounts.length > 0) {
      contract.methods.balanceOf(accounts[0]).call()
        .then(balance => {
          setBalance(web3.utils.fromWei(balance, 'ether'));
        });
    }
  }, [web3, contract, accounts]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (accounts.length === 0) {
      console.error('Nenhuma conta disponível.');
      return;
    }

    const weiValue = web3.utils.toWei(amount, 'ether');
    try {
      await contract.methods.transfer(recipient, weiValue).send({ from: accounts[0] });
      console.log('Transferência realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao realizar a transferência:', error);
    }
  };

  // Função para carregar o histórico de transações
const loadTransactionHistory = async () => {
  if (!web3 || !contract || accounts.length === 0) {
    console.error('Web3 ou contrato não está inicializado ou conta não está disponível.');
    return;
  }

  try {
    const account = accounts[0];
    let transactionCount = await contract.methods.getTransactionCount(account).call();
    let number = Number(transactionCount);
    
    const transactions = [];
    for (let i = 0; i < number; i++) {
      const transaction = await contract.methods.getTransaction(account, i).call();
      console.log(transaction)
      transactions.push({
        id: i,
        from: transaction[0],
        to: transaction[1],
        value: web3.utils.fromWei(transaction[2], 'ether'),
        blockNumber: transaction[3]
      });
    }
    setTransacoesRecentes(transactions);
  } catch (error) {
    console.error('Erro ao carregar o histórico de transações:', error);
  }
};

// Carregar o histórico de transações quando a carteira estiver disponível
useEffect(() => {
  loadTransactionHistory();
}, [web3, contract, accounts]); // A dependência `accounts` garante que o histórico é recarregado quando a conta mudar

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
          <FaLeaf className="mr-2"/> Carteira Ecológica
        </h1>
        
        <div className="mb-4">
          <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="saldo">
            Saldo Atual
          </label>
          <div className="flex items-center bg-green-200 p-3 rounded">
            <FaRegMoneyBillAlt className="text-green-700 mr-2"/>
            <span className="text-green-700">{balance} ECTK</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="transacao">
            Nova Transação
          </label>
          <form onSubmit={handleSend}>
          <div className="mb-4">
            <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="recipient">
              Endereço do Destinatário
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
              id="recipient"
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="amount">
              Quantia
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="text"
              placeholder="Quantia de ECTK a enviar"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar Tokens
          </button>
        </form>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-green-800 mb-2">Últimas Transações</h2>
          <ul className="list-disc list-inside">
            {transacoesRecentes.map(transacao => (
              <li key={transacao.id} className="text-green-700 bg-slate-100 p-2 mb-3 rounded-2xl shadow-md hover:bg-slate-300">
                {transacao?.to} -- {transacao?.from} === {transacao.value} ETCK
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
