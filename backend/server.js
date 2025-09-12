   const express = require('express');
   const path = require('path');

   const app = express();
   const PORT = process.env.PORT || 3000;

   // Serve arquivos estáticos a partir da pasta 'public'
   app.use(express.static('public'));

   // Rota principal (opcional)
   app.get('/', (req, res) => {
       res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });

   app.listen(PORT, () => {
       console.log(`Servidor rodando na porta ${PORT}`);
   });
