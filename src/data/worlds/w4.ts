import type { World } from '../../types';

export const w4: World = {
  id: 'w4',
  n: 'Mundo 4',
  t: 'Cidade das Lágrimas',
  sub: 'A capital de Hallownest, sob chuva eterna. Aqui mora o ferreiro que melhora o seu prego.',
  pal: { bg1: '#080c18', bg2: '#14224a', acc: '#b8d4ff', acc2: '#5c86d0', glow: 'rgba(130,180,255,.28)' },
  fx: 'rain',
  scene: 'city',
  vids: [{ c: 'Red Spirit', t: 'City of Tears · Hollow Knight 112% Guide', u: 'https://www.youtube.com/watch?v=iUkfoQjtu3Y' }],
  items: [
    ['boss', 'Soul Master (Soul Sanctum)', 'Chefe de duas fases. Recompensa: Desolate Dive.', 'Soul Master'],
    ['ability', 'Desolate Dive (Mergulho Desolado)', 'Feitiço para baixo. Também abre áreas novas.', 'Desolate Dive'],
    ['nail', 'Nailsmith: Sharpened Nail (250 Geo)', 'Primeiro upgrade só com Geo. Os próximos pedem Pale Ore.', 'Nailsmith', 'anvil'],
    ['nail', 'Nailsmith: Channelled Nail (800 Geo + 1 Pale Ore)', 'Precisa do primeiro Pale Ore.', 'Nailsmith', 'anvil'],
    ['charm', 'Spell Twister', 'Fica na Soul Sanctum.', 'Spell Twister'],
    ['npc', 'Relic Seeker Lemm', 'Compra relíquias que você achar.', 'Relic Seeker Lemm', 'person'],
    ['npc', 'Cornifer e banco', 'Mapa da cidade. O banco te leva perto do Soul Master.', 'Cornifer', 'bench'],
    ['npc', 'Abrir a City Storerooms Stag', 'Estação de viagem do lado oeste da cidade.', 'Stag Station', 'stag'],
    ['npc', 'Comprar o Elegant Key (Sly) para abrir a porta da Sanctum', 'Leva ao Shade Soul, o upgrade do Vengeful Spirit.', 'Elegant Key', 'key'],
    ['npc', 'Lumafly Lantern (Sly, 1800 Geo)', 'Ilumina cavernas escuras. Muito útil depois.', 'Lumafly Lantern', 'lantern'],
    // --- novos ---
    ['npc', 'Libertar os Grubs da área', 'Confira no mapa quais jaulas faltam. (conferir quantos no wiki)', 'Grub', 'grub'],
  ],
};
