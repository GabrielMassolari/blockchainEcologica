import React from 'react';
import 'tailwindcss/tailwind.css';
import { FaLeaf } from 'react-icons/fa';

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <FaLeaf className="text-green-500 text-6xl"/>
        </div>

        <h2 className="text-center text-2xl font-bold text-green-800 mb-4">Entrar no Sistema</h2>

        <form>
          <div className="mb-4">
            <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
            />
          </div>

          <div className="flex items-center justify-between">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Entrar
            </button>
            <a href="#" className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800">
              Esqueceu sua senha?
            </a>
          </div>
        </form>

        <p className="text-center text-green-700 mt-6">
          Não tem uma conta? <a href="#" className="text-green-500 hover:text-green-800 font-bold">Registre-se</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
