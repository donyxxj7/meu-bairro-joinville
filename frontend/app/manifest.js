// frontend/app/manifest.js
export default function manifest() {
  return {
    name: 'Meu Bairro Joinville',
    short_name: 'Meu Bairro JVE',
    description: 'A voz da sua comunidade em Joinville. Registre e acompanhe ocorrências no seu bairro.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff', // Cor de fundo da tela de splash
    theme_color: '#2d3748', // Cor da barra de ferramentas do navegador (um cinza escuro)
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '96x96',
        type: 'image/png'
      }
    ],
  }
}