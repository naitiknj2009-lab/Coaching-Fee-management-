import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory does not exist: ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const distDir = path.resolve('dist');
const androidAssetsDir = path.resolve('app', 'src', 'main', 'assets', 'public');

console.log(`Copying web bundle from ${distDir} to ${androidAssetsDir}...`);
copyDir(distDir, androidAssetsDir);
console.log('Web assets successfully synced to Android assets!');
