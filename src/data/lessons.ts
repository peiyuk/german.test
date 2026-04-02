import { Lesson } from './types';

export const lessons: Lesson[] = [
  {
    id: 'alphabet-basics',
    title: '德語字母表',
    subtitle: 'Das Alphabet',
    level: 'beginner',
    category: 'alphabet',
    description: '學習26個德語字母的名稱與基本發音。德語字母與英語相同，但發音規則不同。',
    xp: 50,
    phonemes: [
      { id: 'A', symbol: 'A a', name: 'A', description: '發 /aː/，類似中文「啊」，口型張大', tip: '嘴巴張大，發清晰的「啊」音', soundSample: 'a', examples: [{ word: 'Apfel', meaning: '蘋果', ipa: '/ˈapfəl/' }, { word: 'Arbeit', meaning: '工作', ipa: '/ˈaʁbaɪt/' }], audioHint: 'like "ah" in "father"' },
      { id: 'E', symbol: 'E e', name: 'E', description: '發 /eː/，類似「欸」，嘴角微拉', tip: '嘴角向兩側拉，發「欸」音', soundSample: 'e', examples: [{ word: 'Eis', meaning: '冰', ipa: '/aɪs/' }, { word: 'Ende', meaning: '結束', ipa: '/ˈɛndə/' }], audioHint: 'like "ay" in "say"' },
      { id: 'I', symbol: 'I i', name: 'I', description: '發 /iː/，類似「一」，嘴角拉開', tip: '嘴角盡量拉開，發「一」音', soundSample: 'i', examples: [{ word: 'Igel', meaning: '刺蝟', ipa: '/ˈiːɡəl/' }, { word: 'immer', meaning: '總是', ipa: '/ˈɪmɐ/' }], audioHint: 'like "ee" in "see"' },
      { id: 'O', symbol: 'O o', name: 'O', description: '發 /oː/，類似「喔」，嘴唇圓', tip: '嘴唇圓而突出，發「喔」音', soundSample: 'o', examples: [{ word: 'Ohr', meaning: '耳朵', ipa: '/oːɐ/' }, { word: 'Ort', meaning: '地方', ipa: '/ɔʁt/' }], audioHint: 'like "oh" in "go"' },
      { id: 'U', symbol: 'U u', name: 'U', description: '發 /uː/，類似「烏」，嘴唇更圓', tip: '嘴唇縮成小圓，發「烏」音', soundSample: 'u', examples: [{ word: 'Uhr', meaning: '時鐘', ipa: '/uːɐ/' }, { word: 'und', meaning: '和', ipa: '/ʊnt/' }], audioHint: 'like "oo" in "moon"' },
    ],
  },
  {
    id: 'vowels-long-short',
    title: '長母音與短母音',
    subtitle: 'Lange und kurze Vokale',
    level: 'beginner',
    category: 'vowels',
    description: '德語母音有長短之分，長母音音調延長，短母音短促有力。掌握這個差異對正確發音至關重要。',
    xp: 60,
    phonemes: [
      { id: 'a-long', symbol: 'a (lang)', name: '長音 a', description: '長音 /aː/，持續較久，如 "Vater"', tip: '把「啊」拉長約0.5秒', soundSample: 'aa', examples: [{ word: 'Vater', meaning: '父親', ipa: '/ˈfaːtɐ/' }, { word: 'Staat', meaning: '國家', ipa: '/ʃtaːt/' }], audioHint: '"aah" held longer' },
      { id: 'a-short', symbol: 'a (kurz)', name: '短音 a', description: '短音 /a/，短促，如 "Mann"', tip: '快速發出「啊」，不拖音', soundSample: 'a', examples: [{ word: 'Mann', meaning: '男人', ipa: '/man/' }, { word: 'kann', meaning: '能夠', ipa: '/kan/' }], audioHint: '"a" in "cat", short' },
      { id: 'e-long', symbol: 'e (lang)', name: '長音 e', description: '長音 /eː/，如 "See"', tip: '嘴角拉開，發長「欸」', soundSample: 'See', examples: [{ word: 'See', meaning: '湖', ipa: '/zeː/' }, { word: 'Tee', meaning: '茶', ipa: '/teː/' }], audioHint: '"ay" in "say", held' },
      { id: 'e-short', symbol: 'e (kurz)', name: '短音 e', description: '短音 /ɛ/，如 "Bett"', tip: '短促的「欸」，口型稍開', soundSample: 'Bett', examples: [{ word: 'Bett', meaning: '床', ipa: '/bɛt/' }, { word: 'Heft', meaning: '本子', ipa: '/hɛft/' }], audioHint: '"e" in "bed"' },
      { id: 'i-long', symbol: 'i (lang)', name: '長音 i', description: '長音 /iː/，如 "ihn"', tip: '嘴角拉開，發長「一」', soundSample: 'ihn', examples: [{ word: 'ihn', meaning: '他（受格）', ipa: '/iːn/' }, { word: 'Knie', meaning: '膝蓋', ipa: '/kniː/' }], audioHint: '"ee" in "see", held' },
      { id: 'i-short', symbol: 'i (kurz)', name: '短音 i', description: '短音 /ɪ/，如 "mit"', tip: '短促的「一」，稍微放鬆', soundSample: 'mit', examples: [{ word: 'mit', meaning: '與、用', ipa: '/mɪt/' }, { word: 'bis', meaning: '直到', ipa: '/bɪs/' }], audioHint: '"i" in "bit"' },
    ],
  },
  {
    id: 'umlauts',
    title: '德語變音字母',
    subtitle: 'Umlaute: Ä Ö Ü',
    level: 'beginner',
    category: 'umlauts',
    description: '德語特有的三個變音字母 Ä、Ö、Ü 是初學者必須掌握的關鍵發音，英語中沒有完全對應的音。',
    xp: 80,
    phonemes: [
      { id: 'ae-long', symbol: 'Ä ä (lang)', name: '長音 Ä', description: '長音 /ɛː/，類似英文 "air"，嘴巴比 E 更開', tip: '發「欸」時嘴巴再張開一些', soundSample: 'ä', examples: [{ word: 'Mädchen', meaning: '女孩', ipa: '/ˈmɛːtçən/' }, { word: 'Käse', meaning: '起司', ipa: '/ˈkɛːzə/' }], audioHint: '"air" in English, held' },
      { id: 'ae-short', symbol: 'Ä ä (kurz)', name: '短音 Ä', description: '短音 /ɛ/，短促，如 "Männer"', tip: '短促的開口「欸」音', soundSample: 'Männer', examples: [{ word: 'Männer', meaning: '男人們', ipa: '/ˈmɛnɐ/' }, { word: 'Hände', meaning: '手（複數）', ipa: '/ˈhɛndə/' }], audioHint: '"e" in "bed"' },
      { id: 'oe-long', symbol: 'Ö ö (lang)', name: '長音 Ö', description: '長音 /øː/，發「欸」的同時嘴唇圓起來', tip: '先發「欸」，再慢慢把嘴唇圓起來，保持舌頭位置', soundSample: 'ö', examples: [{ word: 'schön', meaning: '美麗的', ipa: '/ʃøːn/' }, { word: 'König', meaning: '國王', ipa: '/ˈkøːnɪç/' }], audioHint: 'French "eu", like "sir" with rounded lips' },
      { id: 'oe-short', symbol: 'Ö ö (kurz)', name: '短音 Ö', description: '短音 /œ/，如 "Hölle"', tip: '短促版的圓唇「欸」音', soundSample: 'Hölle', examples: [{ word: 'Hölle', meaning: '地獄', ipa: '/ˈhœlə/' }, { word: 'Wörter', meaning: '單詞們', ipa: '/ˈvœʁtɐ/' }], audioHint: '"u" in "hurt" with rounded lips' },
      { id: 'ue-long', symbol: 'Ü ü (lang)', name: '長音 Ü', description: '長音 /yː/，發「一」時嘴唇圓起來', tip: '先發「一」，再把嘴唇圓成O型，舌頭不動', soundSample: 'ü', examples: [{ word: 'über', meaning: '在...上方', ipa: '/ˈyːbɐ/' }, { word: 'Tür', meaning: '門', ipa: '/tyːɐ/' }], audioHint: 'French "u", like "ee" with rounded lips' },
      { id: 'ue-short', symbol: 'Ü ü (kurz)', name: '短音 Ü', description: '短音 /ʏ/，如 "fünf"', tip: '短促版的圓唇「一」音', soundSample: 'fünf', examples: [{ word: 'fünf', meaning: '五', ipa: '/fʏnf/' }, { word: 'füllen', meaning: '填充', ipa: '/ˈfʏlən/' }], audioHint: '"u" in French "tu", short' },
    ],
  },
  {
    id: 'diphthongs',
    title: '雙母音',
    subtitle: 'Diphthonge',
    level: 'beginner',
    category: 'diphthongs',
    description: '德語的三個主要雙母音：ei/ai、au、eu/äu，每個都是兩個音的滑音結合。',
    xp: 70,
    phonemes: [
      { id: 'ei', symbol: 'ei / ai', name: '雙母音 ei', description: '/aɪ/，從「啊」滑向「一」，類似英文 "I"', tip: '從張嘴的「啊」快速滑向「一」', soundSample: 'ei', examples: [{ word: 'Eis', meaning: '冰', ipa: '/aɪs/' }, { word: 'mein', meaning: '我的', ipa: '/maɪn/' }, { word: 'Arbeit', meaning: '工作', ipa: '/ˈaʁbaɪt/' }], audioHint: 'like "eye" or "I" in English' },
      { id: 'au', symbol: 'au', name: '雙母音 au', description: '/aʊ/，從「啊」滑向「烏」，類似英文 "ow"', tip: '從張嘴的「啊」快速滑向「烏」', soundSample: 'au', examples: [{ word: 'Haus', meaning: '房子', ipa: '/haʊs/' }, { word: 'Baum', meaning: '樹', ipa: '/baʊm/' }, { word: 'Frau', meaning: '女人/太太', ipa: '/fʁaʊ/' }], audioHint: 'like "ow" in "cow"' },
      { id: 'eu', symbol: 'eu / äu', name: '雙母音 eu', description: '/ɔʏ/，從「歐」滑向「一」，類似英文 "oy"', tip: '從圓唇的「歐」快速滑向「一」', soundSample: 'eu', examples: [{ word: 'neu', meaning: '新的', ipa: '/nɔʏ/' }, { word: 'heute', meaning: '今天', ipa: '/ˈhɔʏtə/' }, { word: 'Häuser', meaning: '房子們', ipa: '/ˈhɔʏzɐ/' }], audioHint: 'like "oy" in "boy"' },
    ],
  },
  {
    id: 'special-consonants',
    title: '特殊子音',
    subtitle: 'Besondere Konsonanten',
    level: 'elementary',
    category: 'consonants',
    description: '德語有幾個英語中沒有的特殊子音，包括小舌音 R、喉音 ch 和 ß。',
    xp: 90,
    phonemes: [
      { id: 'ch-ich', symbol: 'ch (ich-Laut)', name: '軟 ch 音', description: '/ç/，發生在 e, i, ä, ö, ü 後，類似輕輕的噝聲', tip: '舌頭前端靠近上顎，讓氣流通過，發出輕柔的「嘿」聲', soundSample: 'ich', examples: [{ word: 'ich', meaning: '我', ipa: '/ɪç/' }, { word: 'nicht', meaning: '不', ipa: '/nɪçt/' }, { word: 'Mädchen', meaning: '女孩', ipa: '/ˈmɛːtçən/' }], audioHint: 'like "h" in "huge" or German "ich"' },
      { id: 'ch-ach', symbol: 'ch (ach-Laut)', name: '硬 ch 音', description: '/x/，發生在 a, o, u 後，喉嚨深處的摩擦音', tip: '舌根靠近軟顎，讓氣流摩擦通過，類似漱口的感覺', soundSample: 'ach', examples: [{ word: 'ach', meaning: '啊（感嘆）', ipa: '/ax/' }, { word: 'Buch', meaning: '書', ipa: '/buːx/' }, { word: 'Nacht', meaning: '夜晚', ipa: '/naxt/' }], audioHint: 'like Scottish "loch" or clearing throat' },
      { id: 'r-uvular', symbol: 'R r', name: '小舌 R', description: '/ʁ/，德語的 R 是喉嚨深處的小舌顫音', tip: '舌根靠近小舌，發出類似漱口的輕微顫動', soundSample: 'rot', examples: [{ word: 'rot', meaning: '紅色', ipa: '/ʁoːt/' }, { word: 'Regen', meaning: '雨', ipa: '/ˈʁeːɡən/' }, { word: 'Brot', meaning: '麵包', ipa: '/bʁoːt/' }], audioHint: 'like French "r", gargling sound' },
      { id: 'sz', symbol: 'ß', name: 'Eszett / 銳 s', description: '/s/，等同雙 ss，使用在長母音或雙母音後', tip: '直接發清晰的「s」音，比 ss 稍微柔和', soundSample: 'heiß', examples: [{ word: 'Straße', meaning: '街道', ipa: '/ˈʃtʁaːsə/' }, { word: 'heiß', meaning: '熱的', ipa: '/haɪs/' }, { word: 'Maß', meaning: '量度', ipa: '/maːs/' }], audioHint: 'like "ss" in "kiss"' },
      { id: 'st-sp', symbol: 'st / sp', name: 'st 和 sp 組合', description: '/ʃt/ /ʃp/，在字首時 s 讀作 sch 的音', tip: '字首的 st 讀「什特」，sp 讀「什普」', soundSample: 'Stadt', examples: [{ word: 'Straße', meaning: '街道', ipa: '/ˈʃtʁaːsə/' }, { word: 'sprechen', meaning: '說話', ipa: '/ˈʃpʁɛçən/' }, { word: 'Stadt', meaning: '城市', ipa: '/ʃtat/' }], audioHint: '"sht" for st, "shp" for sp at word start' },
      { id: 'w', symbol: 'W w', name: 'W 的發音', description: '/v/，德語 W 發英語 V 的音', tip: '上齒輕咬下唇，發「v」音，不是英語的「w」', soundSample: 'wie', examples: [{ word: 'Wasser', meaning: '水', ipa: '/ˈvasɐ/' }, { word: 'wie', meaning: '如何/像', ipa: '/viː/' }, { word: 'Welt', meaning: '世界', ipa: '/vɛlt/' }], audioHint: 'like English "v", not "w"' },
      { id: 'v', symbol: 'V v', name: 'V 的發音', description: '/f/ 或 /v/，德語 V 通常發 F 的音', tip: '德語原生詞中 V 發「f」音；外來詞發「v」音', soundSample: 'Vater', examples: [{ word: 'Vater', meaning: '父親', ipa: '/ˈfaːtɐ/' }, { word: 'Vogel', meaning: '鳥', ipa: '/ˈfoːɡəl/' }, { word: 'Violine', meaning: '小提琴', ipa: '/vioˈliːnə/' }], audioHint: 'like "f" in most German words' },
    ],
  },
  {
    id: 'consonant-clusters',
    title: '子音組合',
    subtitle: 'Konsonantenverbindungen',
    level: 'elementary',
    category: 'consonants',
    description: '德語常見的子音組合，掌握這些組合能讓你的發音更自然流暢。',
    xp: 80,
    phonemes: [
      { id: 'sch', symbol: 'sch', name: 'sch 音', description: '/ʃ/，類似英語 "sh"，如 "Schule"', tip: '嘴唇稍微突出，發「嘘」的音', soundSample: 'Schuh', examples: [{ word: 'Schule', meaning: '學校', ipa: '/ˈʃuːlə/' }, { word: 'schön', meaning: '美麗', ipa: '/ʃøːn/' }, { word: 'Fisch', meaning: '魚', ipa: '/fɪʃ/' }], audioHint: 'like "sh" in "shoe"' },
      { id: 'tsch', symbol: 'tsch', name: 'tsch 音', description: '/tʃ/，類似英語 "ch"，如 "deutsch"', tip: '先發「t」再快速滑向「嘘」', soundSample: 'deutsch', examples: [{ word: 'deutsch', meaning: '德語/德國的', ipa: '/dɔʏtʃ/' }, { word: 'Tschüss', meaning: '再見', ipa: '/tʃʏs/' }], audioHint: 'like "ch" in "church"' },
      { id: 'ng', symbol: 'ng', name: 'ng 音', description: '/ŋ/，如英語 "ng"，鼻腔共鳴', tip: '舌根靠近軟顎，讓氣流從鼻子出', soundSample: 'lang', examples: [{ word: 'lang', meaning: '長的', ipa: '/laŋ/' }, { word: 'Angst', meaning: '恐懼', ipa: '/aŋst/' }, { word: 'singen', meaning: '唱歌', ipa: '/ˈzɪŋən/' }], audioHint: 'like "ng" in "sing"' },
      { id: 'z', symbol: 'Z z', name: 'Z 的發音', description: '/ts/，德語 Z 讀作「ts」，如 "Zeit"', tip: '先發「t」再快速接「s」，如「次」的輔音部分', soundSample: 'zehn', examples: [{ word: 'Zeit', meaning: '時間', ipa: '/tsaɪt/' }, { word: 'zwei', meaning: '二', ipa: '/tsvaɪ/' }, { word: 'zehn', meaning: '十', ipa: '/tseːn/' }], audioHint: 'like "ts" in "cats"' },
    ],
  },
];

export const getLessonById = (id: string): Lesson | undefined =>
  lessons.find((l) => l.id === id);

export const getLessonsByCategory = (category: Lesson['category']): Lesson[] =>
  lessons.filter((l) => l.category === category);

export const getTotalXP = (): number =>
  lessons.reduce((sum, l) => sum + l.xp, 0);
