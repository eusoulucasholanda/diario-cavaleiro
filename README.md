# Diário do Cavaleiro

Checklist gamificado da minha gameplay de Hollow Knight. Mobile first, funciona offline, dois perfis de save (Guerreiro e Mago).

## Como rodar

```bash
npm install
npm run dev        # abre em http://localhost:5173 e mostra o endereço da rede pra abrir no celular
npm run build      # gera a pasta dist/ (site estático: Netlify, Vercel ou Hostinger)
npm run preview    # testa o build, inclusive o modo offline
```

No celular: mesma rede Wi-Fi, abra o endereço "Network" que o `npm run dev` mostra. Depois de publicado, use "Adicionar à tela inicial" para virar app e funcionar offline.

## Como colocar minhas imagens

Dois jeitos:

1. **Pelo app (mais fácil):** em qualquer quadro de imagem, toque em "trocar print" ou foque o quadro e cole (Ctrl+V). Fica salvo no aparelho (IndexedDB). Não vai para a nuvem nem para o backup JSON.
2. **Por arquivo:** coloque o arquivo em `public/img/` com o nome que o placeholder mostra. Os nomes ficam em `src/images.ts`:
   - `cavaleiro-topo.png`, `cavaleiro-meio.png`, `cavaleiro-fim.png`
   - `mapa-w1.png` ... `mapa-w4.png` (print do mapa de cada mundo; legenda e data se editam no app)
   - `tela-amuletos.png`, `inventario.png` (Forja)
   - `chefes/gruz-mother.png` etc. Foto de qualquer item: em `IMAGES.items`, a chave é o título exato do item. A foto substitui o ícone.

O print do app tem prioridade sobre o arquivo. Sem nenhum dos dois, aparece o placeholder.

## Como adicionar um mundo novo

1. Copie `src/data/worlds/w4.ts` para `w5.ts`, troque `id: 'w5'`, nome, paleta, `fx` (`dust`, `spores` ou `rain`), `scene` e itens.
2. Em `src/data/worlds/index.ts`, importe e coloque na lista `WORLDS`.
3. (Opcional) Em `src/images.ts`, adicione `w5: 'img/mapa-w5.png'` em `maps`.

Cenários disponíveis: `crossroads`, `greenpath`, `fungal`, `city`. Um cenário novo é uma função em `src/components/Scene.tsx`.

## Como adicionar itens

Cada item é `[tipo, título, dica, nomeNoWiki?, ícone?]`.

- Tipos: `boss`, `ability`, `charm`, `mask`, `nail`, `npc` (define o grupo e o XP).
- `nomeNoWiki`: nome em inglês para o botão "ver no wiki". `''` esconde o botão. Sem ele, usa o título até o primeiro "(".
- Ícones: `skull hex mask nail claw flame map bench stag shop book key lantern person anvil grub coin`.
- Escreva "(conferir no wiki)" na dica para aparecer a etiqueta "conferir".

**Importante:** sempre adicione no FIM da lista. O progresso salvo usa a posição (`w1:3` = 4º item do Mundo 1). Inserir no meio desloca as marcações. Vale o mesmo para `NOTCHES` e `CHARMS` em `src/data/forge.ts`.

## Como exportar o progresso

⚙ Configurações > **Exportar JSON** baixa os dois perfis. No outro aparelho: **Importar JSON**. Ali também estão o spoiler leve (até qual mundo está destravado) e o "Zerar perfil" (dois toques).

## Supabase (opcional, desligado)

1. Rode `supabase/progress.sql` no seu projeto (tabela `progress`, uma linha por perfil, com RLS). Leia os comentários do arquivo antes.
2. Copie `.env.example` para `.env` e preencha URL e chave anon.
3. `npm run build` de novo.

Sem `.env`, o app usa só o armazenamento local. Com ele, puxa da nuvem ao abrir (vence o mais recente) e salva sozinho a cada mudança.
