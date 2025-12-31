const fs = require('fs');
const https = require('https');
const path = require('path');

const fonts = [
  {
    name: 'BebasNeue-Regular.woff2',
    url: 'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49a4.woff2'
  },
  {
    name: 'YesevaOne-Regular.woff2',
    url: 'https://fonts.gstatic.com/s/yesevaone/v22/OpNJno4ck8vc-xYlrW6M8VYwB4e4.woff2'
  },
  {
    name: 'Unbounded-VariableFont_wght.woff2',
    url: 'https://fonts.gstatic.com/s/unbounded/v7/Yq6F-LOTXCb04q32xlpat-6uR42XT2nJ.woff2'
  }
];

const fontsDir = path.join(process.cwd(), 'public/fonts');

// Crear directorio si no existe
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Función para descargar archivos
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (error) => {
      fs.unlink(filePath, () => {});
      reject(error);
    });
  });
}

// Descargar todas las fuentes
async function downloadFonts() {
  try {
    for (const font of fonts) {
      const filePath = path.join(fontsDir, font.name);
      console.log(`Descargando ${font.name}...`);
      await downloadFile(font.url, filePath);
      console.log(`${font.name} descargado correctamente.`);
    }
    console.log('¡Todas las fuentes se han descargado correctamente!');
  } catch (error) {
    console.error('Error al descargar las fuentes:', error);
  }
}

downloadFonts();
