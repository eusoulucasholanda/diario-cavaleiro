/*
  Mapa de imagens. Coloque os arquivos em public/img/ com estes nomes
  (ou troque o caminho aqui). Se o arquivo não existir, aparece um placeholder.
  Também dá pra enviar ou colar um print direto no app (fica salvo no aparelho).
  "pos" = ponto de foco do recorte (object-position), pra manter o Cavaleiro no quadro.
*/
export interface Img { src: string; pos?: string }

export const IMAGES = {
  /** imagem do topo, uma por aba (mundo ou forja) */
  hero: {
    w1: { src: 'img/heroi-w1.webp', pos: '22% 30%' },
    w2: { src: 'img/heroi-w2.webp', pos: '30% 25%' },
    w3: { src: 'img/heroi-w3.webp', pos: '50% 30%' },
    w4: { src: 'img/heroi-w4.webp', pos: '50% 25%' },
    forge: { src: 'img/heroi-forja.webp', pos: '50% 20%' },
  } as Record<string, Img>,
  heroDefault: { src: 'img/heroi-w4.webp', pos: '50% 25%' } as Img,
  /** meio da página dentro de cada mundo */
  worldMiddle: { src: 'img/cavaleiro-mundo.webp', pos: '50% 40%' } as Img,
  /** meio da página na Forja */
  middle: { src: 'img/cavaleiro-meio.webp', pos: '35% 40%' } as Img,
  end: { src: 'img/cavaleiro-fim.webp', pos: '50% 30%' } as Img,
  maps: {
    w1: 'img/mapa-w1.webp',
    w2: 'img/mapa-w2.webp',
    w3: 'img/mapa-w3.webp',
    w4: 'img/mapa-w4.webp',
  } as Record<string, string>,
  forge: {
    charms: 'img/tela-amuletos.webp',
    inventory: 'img/inventario.webp',
  },
  /*
    Foto por item (chefe, amuleto, NPC). A chave é o título do item exatamente como está nos dados.
    Exemplo: 'Gruz Mother': 'img/chefes/gruz-mother.png'
  */
  items: {
    'Gruz Mother': 'img/chefes/gruz-mother.png',
    'False Knight': 'img/chefes/false-knight.webp',
    'Brooding Mawlek': 'img/chefes/brooding-mawlek.png',
    'Moss Knight': 'img/chefes/moss-knight.png',
    'Hornet (Greenpath)': 'img/chefes/hornet.png',
    'Massive Moss Charger (opcional)': 'img/chefes/massive-moss-charger.png',
    'Dois Shrumal Ogres': 'img/chefes/shrumal-ogres.png',
    'Mantis Lords (opcional, mas vale)': 'img/chefes/mantis-lords.png',
    'Soul Master (Soul Sanctum)': 'img/chefes/soul-master.png',
  } as Record<string, string>,
};
