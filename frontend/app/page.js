// frontend/app/page.js
import BairrosList from './components/BairrosList';
import ComplaintForm from './components/ComplaintForm';
import MapWrapper from './components/MapWrapper';
import { API_URL } from './config.js'; // A importação está correta

async function getBairros() {
    try {
        // ALTERAÇÃO AQUI: Usando a variável API_URL
        const res = await fetch(`${API_URL}/api/bairros`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao buscar bairros');
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getOcorrencias() {
    try {
        // ALTERAÇÃO AQUI: Usando a variável API_URL
        const res = await fetch(`${API_URL}/api/ocorrencias`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao buscar ocorrências');
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function Home() {
  const bairros = await getBairros();
  const ocorrencias = await getOcorrencias();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-24 bg-gray-50">
      <div className="z-10 w-full max-w-4xl items-center flex flex-col">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 text-center">Meu Bairro Joinville</h1>
        <p className="text-md md:text-lg mb-8 text-gray-600">A voz da sua comunidade</p>

        <div className="w-full mb-12 h-[400px] md:h-[500px]">
          <MapWrapper ocorrencias={ocorrencias} />
        </div>

        <ComplaintForm bairros={bairros} />

        {/* Seção da lista de bairros centralizada novamente */}
        <div className="mt-16 w-full max-w-2xl text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Bairros Atendidos</h2>
            <BairrosList bairros={bairros} />
        </div>
      </div>
    </main>
  );
}