import React from 'react';
import 'tailwindcss/tailwind.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaLeaf, FaWater, FaSun } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

function Dashboard() {
  const dataVariacaoSaldo = [
    { dia: 'Seg', saldo: 0.1 },
    { dia: 'Ter', saldo: 0.15 },
    { dia: 'Qua', saldo: 0.13 },
    { dia: 'Qui', saldo: 0.16 },
    { dia: 'Sex', saldo: 0.14 },
    { dia: 'Sáb', saldo: 0.17 },
    { dia: 'Dom', saldo: 0.19 },
  ];

  const ultimasTransacoes = [
    { id: 1, data: '15/11/2023', tipo: 'Envio', valor: '0.002 BTC' },
    { id: 2, data: '14/11/2023', tipo: 'Recebimento', valor: '0.005 BTC' },
    // Mais dados...
  ]

    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [transacoesRecentes, setTransacoesRecentes] = useState([]);
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [recebido, setRecebido] = useState([]);
    const [enviado, setEnviado] = useState([]);

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

  const fetchTotalTransferred = async () => {
    if (contract && accounts[0]) {
      try {
        const totalTransferred = await contract.methods.getTotalTransferred(accounts[0]).call();
        console.log(totalTransferred);
        setEnviado(web3.utils.fromWei(totalTransferred, 'ether'));
        // Aqui você pode definir o estado ou realizar outras ações com o valor
      } catch (error) {
        console.error("Erro ao buscar o total transferido:", error);
      }
    }
  };

  // Função para obter o total de tokens recebidos pela carteira do usuário
  const fetchTotalReceived = async () => {
    if (contract && accounts[0]) {
      try {
        const totalReceived = await contract.methods.getTotalReceived(accounts[0]).call();
        setRecebido(web3.utils.fromWei(totalReceived, 'ether'));
        // Aqui você pode definir o estado ou realizar outras ações com o valor
      } catch (error) {
        console.error("Erro ao buscar o total recebido:", error);
      }
    }
  };

  useEffect(() => {
    fetchTotalTransferred();
    fetchTotalReceived();
  }, [contract, accounts]);
  
  // Carregar o histórico de transações quando a carteira estiver disponível
  useEffect(() => {
    loadTransactionHistory();
  }, [web3, contract, accounts]); // A dependência `accounts` garante que o histórico é recarregado quando a conta mudar

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-5 bg-green-200 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800 inline-flex items-center">
            <FaLeaf className="mr-2" /> Dashboard Ecológico
          </h1>
          <div className="text-green-700">
            <FaSun className="inline-block" /> Energia Renovável Ativa
          </div>
        </div>

        <div className="p-5 bg-no-repeat bg-opacity-10" style={{ backgroundImage: `url('path/to/leaf-background.png')` }}>
          <h2 className="text-xl font-bold text-green-800 mb-4">Variação do Saldo</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dataVariacaoSaldo}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="saldo" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-between items-center mt-6">
            <div className="flex-1 mr-3">
              <h2 className="text-xl font-bold text-green-800 mb-2">Últimas Transações</h2>
              <ul className="divide-y divide-gray-200">
              <li className="px-6 py-4 flex justify-between">
                <span>
                  <p className="text-sm font-medium text-gray-900">{"Enviado"}</p>
                </span>
                <span>
                  <p className="text-sm font-medium text-gray-900">{enviado}</p>
                </span>
              </li>

              <li className="px-6 py-4 flex justify-between">
              <span>
                  <p className="text-sm font-medium text-gray-900">{"Recebido"}</p>
                </span>
              <span className="text-sm font-medium text-gray-900">{recebido}</span>
              </li>
            </ul>
            </div>
            <div className="w-1/3 bg-green-200 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center">
                <FaWater className="mr-2" /> Impacto Ambiental
              </h3>
              <p className="text-green-700">Você ajudou a economizar 100 kg de CO2 esta semana!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;