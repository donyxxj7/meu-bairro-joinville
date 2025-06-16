require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// --- CONFIGURAÇÃO DOS SERVIÇOS ---
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura o Multer para processar a imagem em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 3001;

// --- INÍCIO DA SOLUÇÃO ---

// Lista de domínios que podem fazer requisições para sua API
const allowedOrigins = [
  'http://localhost:3000',                // Seu ambiente de desenvolvimento local
  'https://www.meubairrojoinville.com',     // Seu site em produção com 'www'
  'https://meubairrojoinville.com'        // Seu site em produção sem 'www'
  // Se a Vercel te deu uma URL terminada em .vercel.app, você pode adicioná-la aqui também.
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (como Postman) ou da nossa lista de permissões
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// --- FIM DA SOLUÇÃO ---
app.use(express.json());

// --- ROTAS DA API ---
app.get('/', (req, res) => res.send('API do Meu Bairro Joinville está no ar!'));

app.get('/api/bairros', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM bairros ORDER BY nome ASC');
        res.json(resultado.rows);
    } catch (err) {
        console.error("Erro ao buscar bairros:", err.message);
        res.status(500).send('Erro no servidor ao buscar bairros.');
    }
});

app.get('/api/ocorrencias', async (req, res) => {
    try {
        const sql = 'SELECT id, tipo_problema, descricao, latitude, longitude, imagem_url FROM ocorrencias ORDER BY data_criacao DESC';
        const resultado = await db.query(sql);
        res.json(resultado.rows);
    } catch (err) {
        console.error("Erro ao buscar ocorrências para o mapa:", err.message);
        res.status(500).send('Erro no servidor ao buscar ocorrências.');
    }
});

app.get('/api/reverse-geocode', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude e Longitude são obrigatórias.' });
    }
    try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        const response = await fetch(nominatimUrl, {
            headers: { 'User-Agent': 'Meu Bairro Joinville App (endonyparadela2007@gmail.com)' }
        });
        if (!response.ok) throw new Error('Falha na comunicação com a API de geocodificação.');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Erro no proxy de geocodificação:", err.message);
        res.status(500).send('Erro interno ao buscar endereço.');
    }
});

app.post('/api/ocorrencias', upload.single('imagem'), async (req, res) => {
    const { tipo_problema, descricao, latitude, longitude, bairro_id, endereco_texto, numero, cep } = req.body;
    const arquivoImagem = req.file;

    if (!tipo_problema || !descricao || !bairro_id) {
        return res.status(400).json({ error: 'Dados essenciais (tipo, descrição, bairro) são obrigatórios.' });
    }

    let imagem_url = null;

    try {
        if (arquivoImagem) {
            console.log('Recebendo imagem, enviando para o Cloudinary...');
            const imagemBase64 = Buffer.from(arquivoImagem.buffer).toString('base64');
            const dataUri = `data:${arquivoImagem.mimetype};base64,${imagemBase64}`;
            const resultadoCloudinary = await cloudinary.uploader.upload(dataUri, {
                folder: 'meu-bairro-joinville'
            });
            imagem_url = resultadoCloudinary.secure_url;
            console.log('Upload para Cloudinary concluído. URL:', imagem_url);
        }

        const sql = `
            INSERT INTO ocorrencias (tipo_problema, descricao, latitude, longitude, bairro_id, endereco_texto, numero, cep, imagem_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *; 
        `;
        const params = [tipo_problema, descricao, latitude, longitude, bairro_id, endereco_texto, numero, cep, imagem_url];
        const result = await db.query(sql, params);
        const novaOcorrencia = result.rows[0];

        const bairroResult = await db.query('SELECT nome FROM bairros WHERE id = $1', [novaOcorrencia.bairro_id]);
        const nomeDoBairro = bairroResult.rows[0]?.nome || 'Não informado';

        const msg = {
            to: 'endonyparadela2007@gmail.com',
            from: process.env.SENDER_EMAIL, 
            subject: `[Meu Bairro Joinville] Nova Ocorrência #${novaOcorrencia.id} - ${tipo_problema} em ${nomeDoBairro}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1>Nova Ocorrência Registrada no Sistema</h1>
                    <p>Uma nova ocorrência foi registrada através da plataforma Meu Bairro Joinville.</p>
                    ${novaOcorrencia.imagem_url ? `<h3 style="color: #555;">Foto Anexada</h3><p><img src="${novaOcorrencia.imagem_url}" alt="Foto da ocorrência" style="max-width: 450px; height: auto; display: block; border: 1px solid #ddd;"></p>` : ''}
                    <hr style="margin-top: 20px;">
                    <h2 style="color: #555;">Detalhes da Ocorrência #${novaOcorrencia.id}</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background-color: #f2f2f2;"><td style="padding: 8px; border: 1px solid #ddd; width: 150px;"><strong>Bairro:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${nomeDoBairro}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tipo do Problema:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${novaOcorrencia.tipo_problema}</td></tr>
                        <tr style="background-color: #f2f2f2;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>Descrição:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${novaOcorrencia.descricao}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status Inicial:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${novaOcorrencia.status}</td></tr>
                        <tr style="background-color: #f2f2f2;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>Data do Registro:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date(novaOcorrencia.data_criacao).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td></tr>
                    </table>
                    <h3 style="color: #555; margin-top: 20px;">Localização Exata</h3>
                    <p><strong>Endereço Registrado:</strong> ${novaOcorrencia.endereco_texto || 'Não informado'}, ${novaOcorrencia.numero || 'S/N'} - CEP: ${novaOcorrencia.cep || 'Não informado'}</p>
                    <p><strong>Coordenadas:</strong> ${novaOcorrencia.latitude}, ${novaOcorrencia.longitude}</p>
                    <p><a href="https://www.google.com/maps/search/?api=1&query=${novaOcorrencia.latitude},${novaOcorrencia.longitude}" target="_blank" style="background-color: #007bff; color: white; padding: 10px 15px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Ver no Google Maps</a></p>
                    <br><br><hr>
                    <p style="font-size: 12px; color: #777;">Este é um e-mail automático enviado pelo sistema Meu Bairro Joinville.</p>
                </div>`,
        };

        if (process.env.SENDGRID_API_KEY) {
            await sgMail.send(msg);
            console.log('E-mail aprimorado enviado com sucesso!');
        }
        
        res.status(201).json(novaOcorrencia);

    } catch (err) {
        console.error("Erro no processo de ocorrência:", err);
        res.status(500).send('Erro no servidor ao registrar ocorrência.');
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});
