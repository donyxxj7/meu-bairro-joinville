// frontend/app/components/ImageUpload.js
'use client';
import { useState, forwardRef } from 'react';

// O componente agora é envolvido por forwardRef para receber a referência do pai
const ImageUpload = forwardRef(({ onFileSelect }, ref) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    } else {
      onFileSelect(null);
      setPreview(null);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="imagem" className="block text-gray-700 text-sm font-bold mb-2">
        Foto do Problema (Opcional):
      </label>
      <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-4">
        {preview && (
          <img src={preview} alt="Pré-visualização" className="h-24 w-24 object-cover rounded-md border" />
        )}
        <input 
          id="imagem" 
          ref={ref} // Atribuímos a referência ao input
          name="imagem" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
    </div>
  );
});

// Adiciona um displayName para facilitar a depuração no React DevTools
ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
