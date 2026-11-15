import type { World } from '../../types';

// Itens novos devem entrar SEMPRE no fim da lista: o progresso salvo usa o índice ("w1:3").
export const w1: World = {
  id: 'w1',
  n: 'Mundo 1',
  t: 'Dirtmouth e Encruzilhada Esquecida',
  sub: 'A cidadezinha de cima e o primeiro labirinto. Faça tudo aqui antes de descer para Greenpath.',
  pal: { bg1: '#0a0c12', bg2: '#1a2030', acc: '#cfd8ff', acc2: '#6f80b8', glow: 'rgba(150,170,255,.25)' },
  fx: 'dust',
  scene: 'crossroads',
  vids: [
    { c: 'Red Spirit', t: 'Forgotten Crossroads · Hollow Knight 112% Guide', u: 'https://www.youtube.com/watch?v=bwR6JmNYAwo' },
    { c: 'Gaming Infection', t: '#1 Dirtmouth · 100% Full Gameplay Walkthrough', u: 'https://www.youtube.com/watch?v=rMaj8FnipHk' },
  ],
  items: [
    ['boss', 'Gruz Mother', 'Chefe que bloqueia o caminho para a vila abandonada.', 'Gruz Mother'],
    ['boss', 'False Knight', 'Recompensa: a City Crest, usada para chegar à Cidade das Lágrimas.', 'False Knight'],
    ['boss', 'Brooding Mawlek', 'Dá uma Mask Shard. Use o pulo na parede para chegar nele.', 'Brooding Mawlek'],
    ['ability', 'Vengeful Spirit (Espírito Vingativo)', 'Primeiro feitiço. Quem dá é o Snail Shaman, no Monte Ancestral (Ancestral Mound). (conferir no wiki)', 'Vengeful Spirit'],
    ['charm', 'Fury of the Fallen', 'Vem bem no começo, perto do caminho do King\'s Pass. (conferir no wiki)', 'Fury of the Fallen'],
    ['charm', 'Gathering Swarm (Sly, 300 Geo)', 'Compre na loja do Sly em Dirtmouth.', 'Gathering Swarm'],
    ['charm', 'Grubsong (Grubfather)', 'Recompensa por libertar Grubs. Passe no Grubfather.', 'Grubsong'],
    ['charm', 'Heavy Blow (Sly, 350 Geo)', 'Loja do Sly.', 'Heavy Blow'],
    ['charm', 'Sprintmaster (Sly, 400 Geo)', 'Loja do Sly.', 'Sprintmaster'],
    ['mask', 'Mask Shard do Sly (150 Geo)', 'Barata e cedo. Compre assim que tiver o Geo.', 'Mask Shard'],
    ['mask', 'Mask Shard do Brooding Mawlek', 'Cai ao derrotar o Mawlek.', 'Mask Shard'],
    ['mask', 'Mask Shard do Grubfather', 'Recompensa por Grubs libertados.', 'Mask Shard'],
    ['mask', 'Mask Shard do desafio dos Goam (sala da fonte termal)', 'Sala da fonte termal, no desafio dos Goam.', 'Mask Shard'],
    ['mask', 'Charm Notch da Salubra (120 Geo / 5 charms)', 'Primeiro slot extra. Os próximos pedem mais Geo e mais charms.', 'Charm Notch', 'hex'],
    ['npc', 'Cornifer: comprar o mapa', 'Compre também a Quill para o mapa se atualizar sozinho.', 'Cornifer', 'map'],
    ['npc', 'Abrir a Estação de Besouro do Crossroads', 'Atalho de viagem entre as áreas.', 'Stag Station', 'stag'],
    ['npc', 'Falar com Quirrel no Templo do Ovo Negro', 'Primeiro encontro.', 'Quirrel', 'person'],
    ['npc', 'Conhecer Salubra e Grubfather', 'Duas lojas/serviços que você vai usar o jogo todo.', 'Salubra', 'shop'],
    // --- novos (fim da lista) ---
    ['npc', 'Libertar os Grubs da área', 'Cada Grub libertado conta pro Grubfather. O mapa do Cornifer ajuda a achar as jaulas. (conferir quantos no wiki)', 'Grub', 'grub'],
    ['npc', 'Pale Ore da Encruzilhada', 'Necessário para o 2º upgrade do prego. (conferir localização no wiki)', 'Pale Ore', 'coin'],
    ['npc', 'Comprar a Wayward Compass (Iselda, 220 Geo)', 'Mostra onde você está quando o mapa está aberto. Iselda fica em Dirtmouth.', 'Wayward Compass', 'map'],
    ['charm', 'Stalwart Shell (Sly, 200 Geo)', 'Fica mais tempo invencível depois de apanhar. Loja do Sly.', 'Stalwart Shell'],
    ['charm', 'Longnail (Salubra, 300 Geo)', 'Aumenta um pouco o alcance do prego. Loja da Salubra.', 'Longnail'],
  ],
};
