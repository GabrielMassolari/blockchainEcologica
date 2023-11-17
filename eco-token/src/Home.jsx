import React from 'react';
import './index.css';
import { FaLeaf, FaRegMoneyBillAlt } from 'react-icons/fa';

function Home() {
  const transacoesRecentes = [
    { id: 1, tipo: 'envio', valor: '0.002 BTC', data: '15/11/2023' },
    { id: 2, tipo: 'recebimento', valor: '0.005 BTC', data: '14/11/2023' },
    // Adicione mais transações aqui
  ];

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
            <span className="text-green-700">0.00 BTC</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="transacao">
            Nova Transação
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="transacao"
            type="text"
            placeholder="Endereço do destinatário"
          />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Quantia"
          />
        </div>

        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Enviar
        </button>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-green-800 mb-2">Últimas Transações</h2>
          <ul className="list-disc list-inside">
            {transacoesRecentes.map(transacao => (
              <li key={transacao.id} className="text-green-700">
                {transacao.tipo}: {transacao.valor} em {transacao.data}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
