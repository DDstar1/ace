const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg';
const targetDir = path.join(__dirname, 'public', '3d');
const targetPath = path.join(targetDir, 'moon-texture.jpg');

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

https.get(url, (response) => {
  if (response.statusCode === 200) {
    const file = fs.createWriteStream(targetPath);
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Moon texture downloaded successfully!');
    });
  } else {
    console.error('Failed to download moon texture:', response.statusCode);
  }
}).on('error', (err) => {
  console.error('Error downloading moon texture:', err.message);
});
