export type ItemType = 'boss' | 'ability' | 'charm' | 'mask' | 'nail' | 'npc';

export type IconKey =
  | 'skull' | 'hex' | 'mask' | 'nail' | 'claw' | 'flame' | 'map' | 'bench' | 'stag'
  | 'shop' | 'book' | 'key' | 'lantern' | 'person' | 'anvil' | 'grub' | 'coin';

export type FxKey = 'dust' | 'spores' | 'rain';
export type SceneKey = 'crossroads' | 'greenpath' | 'fungal' | 'city';
export type ProfileId = 'guerreiro' | 'mago';

/** [tipo, título, dica, nome no wiki em inglês ('' = sem botão), ícone opcional] */
export type Item = [ItemType, string, string, string?, IconKey?];

export interface Palette {
  bg1: string; bg2: string; acc: string; acc2: string; glow: string;
}

export interface World {
  id: string;
  n: string;
  t: string;
  sub: string;
  pal: Palette;
  fx: FxKey;
  scene: SceneKey;
  vids: { c: string; t: string; u: string }[];
  items: Item[];
}

/** [título, dica, mundo ('later' = mais pra frente)] */
export type Notch = [string, string, string];
/** [nome, custo, dica, mundo, conferir?] */
export type Charm = [string, string, string, string, boolean?];
