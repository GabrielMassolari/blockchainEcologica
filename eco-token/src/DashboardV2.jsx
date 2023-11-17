import React from 'react';
import { Line } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';

function DashboardV2() {
  // Dados do gráfico de variação de saldo
  const dataVariacaoSaldo = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Saldo (BTC)',
        data: [0.1, 0.15, 0.13, 0.16, 0.14, 0.17, 0.19],
        backgroundColor: 'rgba(133, 205, 202, 0.2)',
        borderColor: 'rgba(133, 205, 202, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Dados de exemplo para as últimas transações
  const ultimasTransacoes = [
    { id: 1, data: '15/11/2023', tipo: 'Envio', valor: '0.002 BTC' },
    { id: 2, data: '14/11/2023', tipo: 'Recebimento', valor: '0.005 BTC' },
    // Mais dados...
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Dashboard do Usuário - Versão 2</h1>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-green-800 mb-2">Variação do Saldo</h2>
        <Line data={dataVariacaoSaldo} />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-green-800 mb-2">Últimas Transações</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {ultimasTransacoes.map(transacao => (
              <li key={transacao.id} className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900">{transacao.tipo} de {transacao.valor}</p>
                <p className="text-sm text-gray-500">{transacao.data}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Widget de Informações Ambientais */}
      <div className="mb-6 bg-green-200 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-green-800 mb-2">Impacto Ambiental</h3>
        <p className="text-green-700">Sua carteira contribuiu para plantar 15 árvores este mês!</p>
      </div>
    </div>
  );
}

export default DashboardV2;