const fs = require('fs');
const files = [
  'src/pages/Checkout.tsx',
  'src/pages/Orders.tsx',
  'src/pages/Wishlist.tsx',
  'src/pages/admin/AdminProducts.tsx',
  'src/components/ProductCard.tsx',
  'src/pages/ProductDetail.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace \` with `
    content = content.replace(/\\`/g, '`');
    // Replace \${ with ${
    content = content.replace(/\\\${/g, '${');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  } else {
    console.log('Not found', file);
  }
});
