// frontend/app/components/MapWrapper.js
'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react'; // Importamos useState e useEffect

export default function MapWrapper({ ocorrencias }) {
  // 1. Criamos um estado para saber se o componente já "montou" no navegador.
  const [isMounted, setIsMounted] = useState(false);

  // 2. Este código SÓ RODA NO NAVEGADOR, depois da primeira renderização.
  useEffect(() => {
    setIsMounted(true);
  }, []); // O array vazio garante que rode apenas uma vez.

  const DynamicMap = useMemo(() => dynamic(
    () => import('./Map'),
    {
      ssr: false,
      // O estado de 'loading' agora é nosso fallback principal
      loading: () => <div style={{height: '100%', width: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p>Carregando mapa...</p></div>
    }
  ), []);

  // 3. Se o componente ainda não montou no navegador, nós NÃO tentamos renderizar o mapa.
  // Em vez disso, retornamos null ou o mesmo estado de loading. Isso garante que o servidor
  // e a primeira renderização do cliente sejam IDÊNTICAS.
  if (!isMounted) {
    return <div style={{height: '500px', width: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p>Carregando mapa...</p></div>;
  }

  // 4. Apenas depois de ter certeza que estamos no navegador, renderizamos o mapa.
  return <DynamicMap ocorrencias={ocorrencias} />;
}