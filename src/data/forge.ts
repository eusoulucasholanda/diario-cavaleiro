import type { Charm, Notch, Palette, ProfileId } from '../types';

export const FORGE_PAL: Palette = { bg1: '#120a08', bg2: '#2c1810', acc: '#ffcf9a', acc2: '#d0783a', glow: 'rgba(255,150,80,.25)' };

export const START_NOTCHES = 3;
export const MAX_NOTCHES = 11;

// Ordem fixa: o progresso salvo usa o índice (n0, n1...). Novos sempre no fim.
export const NOTCHES: Notch[] = [
  ['Salubra: 1º encaixe (120 Geo, com 5 charms)', 'Mundo 1, Encruzilhada Esquecida. Cabana da Salubra. Ela pede Geo e um número mínimo de charms.', 'w1'],
  ['Salubra: 2º encaixe (500 Geo, com 10 charms)', 'Mesma cabana da Salubra. Volte quando tiver 10 charms.', 'w1'],
  ['Salubra: 3º encaixe (900 Geo, com 18 charms)', 'Mesma cabana. Precisa de 18 charms, então é mais para frente.', 'w1'],
  ['Salubra: 4º encaixe (1400 Geo, com 25 charms)', 'Mesma cabana. Precisa de 25 charms, fica para o meio do jogo.', 'w1'],
  ['Encaixe dos Shrumal Ogres', 'Mundo 3, Fungal Wastes. Derrote os dois Shrumal Ogres na sala ao norte.', 'w3'],
  ['Encaixe escondido em Fog Canyon', 'Fog Canyon, numa área escondida. Pede habilidades de mais tarde. (conferir no wiki)', 'later'],
  ['Encaixe do Coliseu dos Tolos', 'Desafio do Colosseum of Fools. Fica mais para frente. (conferir no wiki)', 'later'],
  ['Encaixe por vencer Grimm', 'Em Dirtmouth, ligado à trupe do Grimm. Fica mais para frente. (conferir no wiki)', 'later'],
];

// Ordem fixa (c0, c1...). c13 = Wayward Compass. Novos sempre no fim.
export const CHARMS: Charm[] = [
  ['Longnail', '2 slots', 'Salubra, 300 Geo. Aumenta um pouco o alcance do prego. Mark of Pride é melhor, mas serve até lá.', 'w1'],
  ['Fury of the Fallen', '2 slots', 'Mundo 1, perto do caminho do King\'s Pass. Dá +75% de dano com 1 máscara.', 'w1', true],
  ['Fragile Strength', '3 slots', 'Mundo 3, Leg Eater, 600 Geo. +50% de dano. Quebra se você morrer.', 'w3'],
  ['Mark of Pride', '3 slots', 'Mundo 3, baú da Vila dos Mantis depois das Mantis Lords. Aumenta o alcance.', 'w3'],
  ['Quick Slash', '3 slots', 'Kingdom\'s Edge, abaixo do Nailmaster Oro, usando Desolate Dive. Aumenta a velocidade do prego.', 'later', true],
  ['Gathering Swarm', '1 slot', 'Mundo 1, Sly, 300 Geo. Puxa o Geo solto.', 'w1'],
  ['Grubsong', '1 slot', 'Mundo 1, Grubfather, por Grubs libertados. Dá Soul quando você apanha.', 'w1'],
  ['Heavy Blow', '2 slots', 'Mundo 1, Sly, 350 Geo. Empurra mais o inimigo.', 'w1'],
  ['Sprintmaster', '1 slot', 'Mundo 1, Sly, 400 Geo. Corre mais rápido.', 'w1'],
  ['Thorns of Agony', '1 slot', 'Mundo 2, Greenpath.', 'w2', true],
  ['Dashmaster', '2 slots', 'Mundo 3, sudeste de Fungal Wastes.', 'w3'],
  ['Spore Shroom', '1 slot', 'Mundo 3, sudoeste de Fungal Wastes. Precisa da Mantis Claw.', 'w3'],
  ['Spell Twister', '2 slots', 'Mundo 4, Soul Sanctum. Feitiços custam menos Soul.', 'w4'],
  ['Wayward Compass', '1 slot', 'Iselda, em Dirtmouth, 220 Geo. Mostra onde você está quando o mapa está aberto.', 'w1'],
  // --- novos (build de mago) ---
  ['Shaman Stone', '3 slots', 'Salubra, 220 Geo. Aumenta o dano e o tamanho dos feitiços.', 'w1', true],
  ['Quick Focus', '3 slots', 'Salubra, 800 Geo. Cura mais rápido.', 'w1'],
  ['Soul Eater', '4 slots', 'Resting Grounds, mais pra frente. Ganha muito mais Soul por golpe.', 'later', true],
  ['Soul Catcher', '2 slots', 'Monte Ancestral. Versão menor do Soul Eater, ótima até lá.', 'w1', true],
];

export interface BuildInfo {
  name: string;
  core: string[];
  coreText: string;
  prio: [string, string][];
}

export const BUILDS: Record<ProfileId, BuildInfo> = {
  guerreiro: {
    name: 'Guerreiro (prego)',
    core: ['Quick Slash', 'Mark of Pride', 'Fragile Strength'],
    coreText: 'Quick Slash + Mark of Pride + Fragile/Unbreakable Strength, 9 slots. Quick Slash dá velocidade, Mark of Pride alcance e Strength dano. Fury of the Fallen entra como opcional.',
    prio: [
      ['Fragile Strength (600 Geo)', 'Maior ganho de dano agora. Compre primeiro no Leg Eater, em Fungal Wastes.'],
      ['Mark of Pride (baú da Vila dos Mantis)', 'Mais alcance. Entra no lugar do Longnail. Precisa vencer as Mantis Lords.'],
      ['Quick Slash (Kingdom\'s Edge)', 'O melhor amuleto de combate. Só depois do Desolate Dive (Soul Master).'],
      ['Encaixes da Salubra conforme os charms', 'Cada encaixe a mais deixa você usar um amuleto a mais na build.'],
      ['Fury of the Fallen (opcional)', 'Arriscado, dá muito dano com 1 máscara. Use depois que dominar os chefes.'],
    ],
  },
  mago: {
    name: 'Mago (feitiços)',
    core: ['Shaman Stone', 'Spell Twister', 'Soul Eater', 'Quick Focus'],
    coreText: 'Shaman Stone + Spell Twister + Soul Eater + Quick Focus, 12 slots (precisa de encaixes extras). Shaman Stone aumenta o dano, Spell Twister barateia o feitiço, Soul Eater enche a Soul e Quick Focus cura rápido entre os feitiços.',
    prio: [
      ['Vengeful Spirit + Shaman Stone', 'Vengeful Spirit com o Snail Shaman no Monte Ancestral e Shaman Stone na Salubra (220 Geo). Juntos já mudam o jogo. (conferir no wiki)'],
      ['Soul Catcher', 'Mais Soul por golpe enquanto o Soul Eater não vem. Fica no Monte Ancestral. (conferir no wiki)'],
      ['Encaixes da Salubra', 'A build completa pede 12 slots, então cada encaixe conta muito aqui.'],
      ['Spell Twister (Soul Sanctum)', 'Feitiço mais barato = mais feitiços seguidos.'],
      ['Desolate Dive e Shade Soul', 'Soul Master dá o Dive; a Elegant Key (Sly) abre o caminho do Shade Soul, a versão forte do Vengeful Spirit.'],
      ['Quick Focus (Salubra, 800 Geo)', 'Cura rápida para não perder o ritmo entre feitiços.'],      ['Soul Eater (Resting Grounds)', 'Troca o Soul Catcher quando chegar lá, mais pra frente.'],
    ],
  },
};

export const NAIL_UPGRADES: [string, string][] = [
  ['Sharpened Nail', '250 Geo'],
  ['Channelled Nail', '800 Geo + 1 Pale Ore'],
  ['Coiled Nail', '2000 Geo + 2 Pale Ore'],
  ['Pure Nail', '4000 Geo + 3 Pale Ore'],
];

// Habilidades: marcadas automaticamente a partir dos itens dos mundos.
export const ABIL: [string, string][] = [
  ['Vengeful Spirit', 'w1:3'],
  ['Mothwing Cloak (dash)', 'w2:3'],
  ['Mantis Claw (parede)', 'w3:2'],
  ['Desolate Dive', 'w4:1'],
];
