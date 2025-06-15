// frontend/app/components/BairrosList.js
'use client';

export default function BairrosList({ bairros }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {bairros.length > 0 ? (
        // MUDANÇA AQUI: Trocamos 'list-inside' por 'list-outside'
        <ul className="list-disc list-outside text-left columns-2 sm:columns-3 gap-x-8 pl-5">
          {bairros.map(bairro => (
            <li key={bairro.id} className="text-gray-600 mb-2 break-inside-avoid">{bairro.nome}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum bairro encontrado.</p>
      )}
    </div>
  );
}