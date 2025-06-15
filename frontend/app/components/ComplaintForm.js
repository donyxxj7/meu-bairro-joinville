'use client';
import { useState, useRef } from 'react';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';
import { API_URL } from '../config.js'; // Importando a nossa URL centralizada

const MAX_DESC_LENGTH = 500;

export default function ComplaintForm({ bairros }) {
    const [tipoProblema, setTipoProblema] = useState('Buraco na Via');
    const [descricao, setDescricao] = useState('');
    const [bairroId, setBairroId] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [cep, setCep] = useState('');
    const [imagem, setImagem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cepError, setCepError] = useState('');
    
    const imageInputRef = useRef(null);

    const validateCep = (cepValue) => {
        const cepLimpo = cepValue.replace(/\D/g, '');
        const cepRegex = /^[0-9]{8}$/;
        if (cepLimpo && !cepRegex.test(cepLimpo)) {
            setCepError('Formato de CEP inválido. Use 8 números.');
        } else {
            setCepError('');
        }
    };

    const handleCepChange = (e) => {
        const newCep = e.target.value;
        setCep(newCep);
        validateCep(newCep);
    };

    const handleLocationClick = async () => {
        const loadingToast = toast.loading('A obter a sua localização...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    toast.dismiss(loadingToast);
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLatitude(lat);
                    setLongitude(lon);
                    
                    const searchingToast = toast.loading('A procurar o endereço...');
                    try {
                        // ALTERAÇÃO AQUI: Usando a variável API_URL
                        const response = await fetch(`${API_URL}/api/reverse-geocode?lat=${lat}&lon=${lon}`);
                        if (!response.ok) throw new Error('Falha ao procurar endereço.');
                        const data = await response.json();
                        
                        if (data && data.address) {
                            setEndereco(data.address.road || '');
                            setNumero(data.address.house_number || '');
                            setCep(data.address.postcode || '');
                            validateCep(data.address.postcode || '');
                            toast.success('Endereço preenchido!');
                        } else {
                           throw new Error("Não foi possível encontrar o endereço para estas coordenadas.");
                        }
                    } catch (error) {
                        toast.error('Não foi possível procurar o endereço.');
                    } finally {
                        toast.dismiss(searchingToast);
                    }
                },
                (error) => {
                    toast.dismiss(loadingToast);
                    toast.error('Permissão de localização negada.');
                }
            );
        } else {
            toast.dismiss(loadingToast);
            toast.error('A geolocalização não é suportada neste navegador.');
        }
    };

    const resetForm = () => {
        setTipoProblema('Buraco na Via');
        setDescricao('');
        setBairroId('');
        setLatitude('');
        setLongitude('');
        setEndereco('');
        setNumero('');
        setCep('');
        setImagem(null);
        setCepError('');
        if(imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!bairroId || !descricao) {
            toast.error('Por favor, preencha a descrição e selecione um bairro.');
            return;
        }
        if (cepError) {
            toast.error('Por favor, corrija o CEP antes de enviar.');
            return;
        }
        if (descricao.length > MAX_DESC_LENGTH) {
            toast.error(`A descrição não pode ter mais que ${MAX_DESC_LENGTH} caracteres.`);
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading('A enviar ocorrência...');
        
        const formData = new FormData();
        formData.append('tipo_problema', tipoProblema);
        formData.append('descricao', descricao);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('bairro_id', parseInt(bairroId, 10));
        formData.append('endereco_texto', endereco);
        formData.append('numero', numero);
        formData.append('cep', cep);
        if (imagem) {
            formData.append('imagem', imagem);
        }

        try {
            // ALTERAÇÃO AQUI: Usando a variável API_URL
            const response = await fetch(`${API_URL}/api/ocorrencias`, {
                method: 'POST',
                body: formData, 
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Falha ao enviar ocorrência.');
            }

            const novaOcorrencia = await response.json();
            toast.success(`Ocorrência #${novaOcorrencia.id} registada com sucesso!`);
            resetForm();
        } catch (error) {
            console.error('Erro no formulário:', error);
            toast.error(`Erro ao registar: ${error.message}`);
        } finally {
            setIsSubmitting(false);
            toast.dismiss(loadingToast);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md border border-gray-200 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registar Nova Ocorrência</h2>
            <form onSubmit={handleSubmit}>
                {/* O JSX do formulário continua o mesmo, sem alterações... */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border text-center">
                    <p className="text-sm text-gray-600 mb-2">Preencha o endereço ou use a sua localização para preencher automaticamente.</p>
                    <button type="button" onClick={handleLocationClick} className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Usar a Minha Localização Atual
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="bairro" className="block text-gray-700 text-sm font-bold mb-2">Bairro <span className="text-red-500">*</span></label>
                        <select id="bairro" value={bairroId} onChange={e => setBairroId(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="" disabled>Selecione um bairro...</option>
                            {bairros.map(bairro => <option key={bairro.id} value={bairro.id}>{bairro.nome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tipo_problema" className="block text-gray-700 text-sm font-bold mb-2">Tipo de Problema</label>
                        <select id="tipo_problema" value={tipoProblema} onChange={e => setTipoProblema(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option>Buraco na Via</option>
                            <option>Iluminação Pública</option>
                            <option>Lixo Acumulado</option>
                            <option>Sinalização</option>
                            <option>Vazamento de Água</option>
                            <option>Outros</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <label htmlFor="endereco" className="block text-gray-700 text-sm font-bold mb-2">Endereço (Rua)</label>
                        <input type="text" id="endereco" placeholder="Ex: Rua das Flores" value={endereco} onChange={e => setEndereco(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="numero" className="block text-gray-700 text-sm font-bold mb-2">Número</label>
                        <input type="text" id="numero" placeholder="Ex: 123" value={numero} onChange={e => setNumero(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="cep" className="block text-gray-700 text-sm font-bold mb-2">CEP</label>
                    <input type="text" id="cep" placeholder="Ex: 89222-000" value={cep} onChange={handleCepChange} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${cepError ? 'border-red-500' : ''}`} />
                    {cepError && <p className="text-red-500 text-xs italic mt-2">{cepError}</p>}
                </div>

                <ImageUpload onFileSelect={setImagem} ref={imageInputRef} />
                
                <div className="mb-4">
                    <label htmlFor="descricao" className="block text-gray-700 text-sm font-bold mb-2">Descrição <span className="text-red-500">*</span></label>
                    <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descreva o problema com o máximo de detalhes possível..." required maxLength={MAX_DESC_LENGTH + 10} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-28"></textarea>
                    <p className={`text-right text-xs mt-1 ${descricao.length > MAX_DESC_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                        {descricao.length}/{MAX_DESC_LENGTH}
                    </p>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400" disabled={isSubmitting || !bairroId || !descricao || !!cepError}>
                        {isSubmitting ? 'A enviar...' : 'Enviar Reclamação'}
                    </button>
                </div>
            </form>
        </div>
    );
}