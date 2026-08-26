const fs = require('fs');
const src = fs.readFileSync('src/ui.js','utf8');
console.log('total lines:', src.split('\n').length);
console.log('has createTouchControlVisuals method:', src.includes('  createTouchControlVisuals()'));
console.log('count of literal backslash-n:', (src.match(/\\n/g)||[]).length);
// Try to actually evaluate the module structure
try {
    new Function(src.replace(/import.*/,'').replace(/export /g,''));
    console.log('Function parse: OK');
} catch(e) {
    console.log('Function parse FAILED:', e.message);
}