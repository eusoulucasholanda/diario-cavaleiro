/*
  Mapa de imagens. Coloque os arquivos em public/img/ com estes nomes
  (ou troque o caminho aqui). Se o arquivo não existir, aparece um placeholder.
  Também dá pra enviar ou colar um print direto no app (fica salvo no aparelho).
*/
export const IMAGES = {
  hero: 'img/cavaleiro-topo.png',
  middle: 'img/cavaleiro-meio.png',
  end: 'img/cavaleiro-fim.png',
  maps: {
    w1: 'img/mapa-w1.png',
    w2: 'img/mapa-w2.png',
    w3: 'img/mapa-w3.png',
    w4: 'img/mapa-w4.png',
  } as Record<string, string>,
  forge: {
    charms: 'img/tela-amuletos.png',
    inventory: 'img/inventario.png',
  },
  /*
    Foto por item (chefe, amuleto, NPC). A chave é o título do item exatamente como está nos dados.
    Exemplo: 'Gruz Mother': 'img/chefes/gruz-mother.png'
  */
  items: {
    'Gruz Mother': 'img/chefes/gruz-mother.png',
    'False Knight': 'img/chefes/false-knight.png',
    'Brooding Mawlek': 'img/chefes/brooding-mawlek.png',
    'Moss Knight': 'img/chefes/moss-knight.png',
    'Hornet (Greenpath)': 'img/chefes/hornet.png',
    'Massive Moss Charger (opcional)': 'img/chefes/massive-moss-charger.png',
    'Dois Shrumal Ogres': 'img/chefes/shrumal-ogres.png',
    'Mantis Lords (opcional, mas vale)': 'img/chefes/mantis-lords.png',
    'Soul Master (Soul Sanctum)': 'img/chefes/soul-master.png',
  } as Record<string, string>,
};
