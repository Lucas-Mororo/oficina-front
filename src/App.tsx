import { useEffect, useState } from 'react';
import { getVeiculos } from './api/api';
import { Veiculo } from './types/index';

function App() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    getVeiculos()
      .then((response) => setVeiculos(response.data))
      .catch((error) => console.error('Erro ao buscar veículos:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Veículos</h1>
      <ul>
        {veiculos.map((veiculo) => (
          <li key={veiculo.id}>
            {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;