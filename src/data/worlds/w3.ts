import type { World } from '../../types';

export const w3: World = {
  id: 'w3',
  n: 'Mundo 3',
  t: 'Ermos Fúngicos (Fungal Wastes)',
  sub: 'Cogumelos e a tribo dos Mantis. Aqui vem a garra de parede e vários amuletos de combate.',
  pal: { bg1: '#140c06', bg2: '#33200c', acc: '#ffd08a', acc2: '#c4803a', glow: 'rgba(255,190,100,.25)' },
  fx: 'spores',
  scene: 'fungal',
  vids: [{ c: 'Red Spirit', t: 'Fungal Wastes · Hollow Knight 112% Guide', u: 'https://www.youtube.com/watch?v=9xpGJ3lBBeQ' }],
  items: [
    ['boss', 'Dois Shrumal Ogres', 'Ao vencer os dois, cai um Charm Notch.', 'Shrumal Ogre'],
    ['boss', 'Mantis Lords (opcional, mas vale)', 'Abre o baú com o Mark of Pride e a passagem para Deepnest.', 'Mantis Lords'],
    ['ability', 'Mantis Claw (pulo na parede)', 'Fica na Vila dos Mantis. Não precisa vencer as Lords para pegar.', 'Mantis Claw'],
    ['charm', 'Fragile Strength (Leg Eater, 600 Geo)', '+50% de dano do prego. Quebra se você morrer, e o Leg Eater conserta.', 'Fragile Strength'],
    ['charm', 'Mark of Pride (baú da Vila dos Mantis)', 'Aumenta o alcance do prego. Abre depois das Mantis Lords.', 'Mark of Pride'],
    ['charm', 'Dashmaster', 'Fica no sudeste da área.', 'Dashmaster'],
    ['charm', 'Spore Shroom', 'Sudoeste, perto de Deepnest. Precisa da Mantis Claw.', 'Spore Shroom'],
    ['mask', 'Charm Notch dos Shrumal Ogres', 'Cai quando os dois Ogres morrem.', 'Charm Notch', 'hex'],
    ['mask', 'Mask Shard da Queen\'s Station', 'Pegue depois da Mantis Claw. (conferir no wiki)', 'Mask Shard'],
    ['npc', 'Abrir a Queen\'s Station (Stag)', 'Grande estação de viagem no oeste.', 'Queen\'s Station', 'stag'],
    ['npc', 'Leg Eater (86 Geo para ver a loja)', 'Vende charms frágeis. O banco dele fica ali perto.', 'Leg Eater', 'shop'],
    ['npc', 'Cornifer, banco e Cloth', 'Mapa, descanso e um aliado de combate.', 'Cloth', 'bench'],
    // --- novos ---
    ['npc', 'Libertar os Grubs da área', 'Confira no mapa quais jaulas faltam. (conferir quantos no wiki)', 'Grub', 'grub'],
  ],
};
