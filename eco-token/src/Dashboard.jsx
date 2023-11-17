import React from 'react';
import 'tailwindcss/tailwind.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaLeaf, FaWater, FaSun } from 'react-icons/fa';

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
  ];

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
              {ultimasTransacoes.map(transacao => (
                <li key={transacao.id} className="px-6 py-4 flex justify-between">
                  <span>
                    <p className="text-sm font-medium text-gray-900">{transacao.tipo}</p>
                    <p className="text-sm text-gray-500">{transacao.data}</p>
                  </span>
                  <span className="text-sm font-medium text-gray-900">{transacao.valor}</span>
                </li>
              ))}
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