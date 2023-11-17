import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTable } from 'react-table';
import 'tailwindcss/tailwind.css';

function Dashboard() {
  // Dados do gráfico de transações
  const dataGraficoTransacoes = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Transações',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dados da tabela de transações
  const dataTabelaTransacoes = [
    { id: 1, data: '15/11/2023', tipo: 'Envio', valor: '0.002 BTC' },
    { id: 2, data: '14/11/2023', tipo: 'Recebimento', valor: '0.005 BTC' },
    // Mais dados...
  ];

  const colunas = React.useMemo(
    () => [
      { Header: 'Data', accessor: 'data' },
      { Header: 'Tipo', accessor: 'tipo' },
      { Header: 'Valor', accessor: 'valor' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: colunas, data: dataTabelaTransacoes });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Dashboard do Usuário</h1>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-green-800 mb-2">Gráfico de Transações</h2>
        <Bar data={dataGraficoTransacoes} />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-green-800 mb-2">Tabela de Transações Detalhadas</h2>
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" key={column.id}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap" key={cell.id}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;