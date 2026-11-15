// npm run publicar: gera o site e envia a pasta dist/ para a branch gh-pages (GitHub Pages).
import { execSync } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';

const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd });
const remote = execSync('git remote get-url origin').toString().trim();

run('npm run build');
writeFileSync('dist/.nojekyll', '');
rmSync('dist/.git', { recursive: true, force: true });
run('git init -q -b gh-pages', 'dist');
run('git add -A', 'dist');
run(`git commit -qm "Publicar ${new Date().toISOString()}"`, 'dist');
run(`git push -f -q ${remote} gh-pages`, 'dist');
rmSync('dist/.git', { recursive: true, force: true });
console.log('\nPublicado: https://eusoulucasholanda.github.io/diario-cavaleiro/ (leva 1 a 2 minutos pra atualizar)');
