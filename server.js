const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve os ficheiros da pasta 'public' (onde fica o index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy para contornar os bloqueios de segurança do WhatsApp Web
app.use('/wa-proxy', createProxyMiddleware({
  target: 'https://web.whatsapp.com',
  changeOrigin: true,
  pathRewrite: { '^/wa-proxy': '' },
  on: {
    proxyReq: (proxyReq) => {
      // Simula um navegador Chrome real
      proxyReq.setHeader(
        'User-Agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
    },
    proxyRes: (proxyRes) => {
      // Remove as regras do WhatsApp que impedem a exibição em quadros/iframes
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});