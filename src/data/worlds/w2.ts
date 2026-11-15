import type { World } from '../../types';

export const w2: World = {
  id: 'w2',
  n: 'Mundo 2',
  t: 'Caminho Verde (Greenpath)',
  sub: 'A floresta de musgo e ácido. Aqui você ganha o dash, que abre quase tudo.',
  pal: { bg1: '#06130c', bg2: '#10301c', acc: '#a8f0b8', acc2: '#4aa86a', glow: 'rgba(110,230,150,.25)' },
  fx: 'spores',
  scene: 'greenpath',
  vids: [{ c: 'Red Spirit', t: 'Greenpath · Hollow Knight 112% Guide', u: 'https://www.youtube.com/watch?v=GaeHd5gvIk8' }],
  items: [
    ['boss', 'Moss Knight', 'Miniboss que libera caminhos mais à frente.', 'Moss Knight'],
    ['boss', 'Hornet (Greenpath)', 'Primeira luta contra ela. Recompensa: Mothwing Cloak.', 'Hornet Protector'],
    ['boss', 'Massive Moss Charger (opcional)', 'Fica no sudoeste, perto de Fog Canyon. Não é obrigatório.', 'Massive Moss Charger'],
    ['ability', 'Mothwing Cloak (dash)', 'Ganha ao derrotar a Hornet.', 'Mothwing Cloak'],
    ['charm', 'Thorns of Agony', 'Amuleto de espinhos. Fica numa sala de Greenpath. (conferir no wiki)', 'Thorns of Agony'],
    ['mask', 'Mask Shard da Stone Sanctuary', 'Fica na área da Stone Sanctuary, em Greenpath. (conferir no wiki)', 'Mask Shard'],
    ['npc', 'Sentar no primeiro banco e comprar o mapa', 'Cornifer vende o mapa da região.', 'Cornifer', 'bench'],
    ['npc', 'Hunter\'s Journal', 'Fica numa sala do sul. Registra os inimigos que você derrota.', 'Hunter\'s Journal', 'book'],
    ['npc', 'Abrir a Estação de Besouro de Greenpath (140 Geo)', 'Mais um atalho de viagem.', 'Stag Station', 'stag'],
    ['npc', 'Wanderer\'s Journal (relíquia atrás de parede quebrável)', 'Perto do banco, atrás de uma parede quebrável.', 'Wanderer\'s Journal', 'book'],
    ['npc', 'Visitar a cabana do Sheo', 'Mestre de prego (Nailmaster). Vale conhecer, ele ensina técnicas de prego mais tarde.', 'Nailmaster Sheo', 'person'],
    // --- novos ---
    ['npc', 'Libertar os Grubs da área', 'Confira no mapa quais jaulas faltam. (conferir quantos no wiki)', 'Grub', 'grub'],
  ],
};
