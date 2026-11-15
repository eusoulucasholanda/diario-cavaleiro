import type { IconKey, ItemType } from '../types';

export const XP: Record<ItemType, number> = { boss: 100, ability: 100, charm: 60, mask: 60, nail: 80, npc: 25 };

export const GROUPS: { type: ItemType; label: string }[] = [
  { type: 'boss', label: 'Chefes e minibosses' },
  { type: 'ability', label: 'Habilidades' },
  { type: 'charm', label: 'Amuletos' },
  { type: 'mask', label: 'Máscaras e encaixes' },
  { type: 'nail', label: 'Upgrades do prego' },
  { type: 'npc', label: 'Pessoas, lojas e lugares' },
];

export const DEFAULT_ICON: Record<ItemType, IconKey> = {
  boss: 'skull', ability: 'claw', charm: 'hex', mask: 'mask', nail: 'nail', npc: 'person',
};

/** % mínimo de conclusão para cada rank */
export const RANKS: [string, number][] = [
  ['Andarilho', 0],
  ['Caçador de Grubs', 10],
  ['Cavaleiro do Cruzamento', 25],
  ['Dançarino de Musgo', 40],
  ['Garra de Mantis', 55],
  ['Ferreiro do Prego', 75],
  ['Guerreiro de Hallownest', 95],
];

/** Progresso do perfil Guerreiro conferido nos prints do jogo de 15/11/2026 (aplicado só em aparelho novo, sem login). */
export const SEED = {
  done: ['w1:1', 'w1:3', 'w1:6', 'w1:11', 'w1:14', 'w1:15', 'w1:17', 'w1:20', 'w1:21', 'w1:22',
    'w2:1', 'w2:3', 'w2:6', 'w2:8', 'w2:12', 'w3:0', 'w3:2', 'w3:7', 'w3:9', 'w4:6', 'w4:7'],
  fk: ['c0', 'c6', 'c13', 'c18', 'c19', 'n0', 'n4'],
};

export const wikiUrl = (name: string) =>
  `https://hollowknight.wiki/w/Special:Search?search=${encodeURIComponent(name)}&go=Go`;
