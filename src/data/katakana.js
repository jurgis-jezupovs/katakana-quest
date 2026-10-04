// Katakana character dataset.
// Each character: { kana, romaji, row, mnemonic, example }
// `mnemonic` is a memory aid to make learning faster (an edge over Duolingo).

export const CHARACTERS = [
  // Vowels
  { kana: 'ア', romaji: 'a', row: 'vowels', mnemonic: 'Looks like an "A"-frame house with a chimney.', example: 'アメリカ (America)' },
  { kana: 'イ', romaji: 'i', row: 'vowels', mnemonic: 'Two lines like the "ea" in "eel" standing tall.', example: 'イタリア (Italy)' },
  { kana: 'ウ', romaji: 'u', row: 'vowels', mnemonic: 'A person saying "ooh!" with a hat on.', example: 'ウール (wool)' },
  { kana: 'エ', romaji: 'e', row: 'vowels', mnemonic: 'Looks like an "E" rotated — an elevator with floors.', example: 'エネルギー (energy)' },
  { kana: 'オ', romaji: 'o', row: 'vowels', mnemonic: 'A person doing the "O" pose, arms out.', example: 'オレンジ (orange)' },

  // K row
  { kana: 'カ', romaji: 'ka', row: 'k', mnemonic: 'A "ka"-tana (sword) cutting through.', example: 'カメラ (camera)' },
  { kana: 'キ', romaji: 'ki', row: 'k', mnemonic: 'A "key" with two teeth.', example: 'キー (key)' },
  { kana: 'ク', romaji: 'ku', row: 'k', mnemonic: 'A "coo"-king beak of a bird.', example: 'クラス (class)' },
  { kana: 'ケ', romaji: 'ke', row: 'k', mnemonic: 'A "ke"-g of beer tilting over.', example: 'ケーキ (cake)' },
  { kana: 'コ', romaji: 'ko', row: 'k', mnemonic: 'An open box — "co"-ntainer corner.', example: 'コーヒー (coffee)' },

  // S row
  { kana: 'サ', romaji: 'sa', row: 's', mnemonic: 'A "sa"-murai cross with a swoosh.', example: 'サラダ (salad)' },
  { kana: 'シ', romaji: 'shi', row: 's', mnemonic: 'A smiling face winking — "shi" giggles. Strokes go bottom-up.', example: 'タクシー (taxi)' },
  { kana: 'ス', romaji: 'su', row: 's', mnemonic: 'A "swing" hanging down.', example: 'スポーツ (sports)' },
  { kana: 'セ', romaji: 'se', row: 's', mnemonic: 'A "se"-saw tilting.', example: 'セーター (sweater)' },
  { kana: 'ソ', romaji: 'so', row: 's', mnemonic: 'A single stitch sewn — "so" we sew. Strokes go top-down.', example: 'ソース (sauce)' },

  // T row
  { kana: 'タ', romaji: 'ta', row: 't', mnemonic: 'A "ta"-dpole with a slash.', example: 'タオル (towel)' },
  { kana: 'チ', romaji: 'chi', row: 't', mnemonic: 'A "cheer"-leader doing a number 7 + line.', example: 'チーズ (cheese)' },
  { kana: 'ツ', romaji: 'tsu', row: 't', mnemonic: 'A smiling face with two eyes (vs シ). Strokes go top-down.', example: 'ツアー (tour)' },
  { kana: 'テ', romaji: 'te', row: 't', mnemonic: 'A "te"-lephone pole.', example: 'テレビ (TV)' },
  { kana: 'ト', romaji: 'to', row: 't', mnemonic: 'A "toe" with a nail sticking out.', example: 'トマト (tomato)' },

  // N row
  { kana: 'ナ', romaji: 'na', row: 'n', mnemonic: 'A "knife" crossing.', example: 'バナナ (banana)' },
  { kana: 'ニ', romaji: 'ni', row: 'n', mnemonic: 'Two lines = "knee"-s, a pair.', example: 'テニス (tennis)' },
  { kana: 'ヌ', romaji: 'nu', row: 'n', mnemonic: 'Looks like ス with an extra "noodle".', example: 'カヌー (canoe)' },
  { kana: 'ネ', romaji: 'ne', row: 'n', mnemonic: 'A complex knot — "ne"-twork of lines.', example: 'ネクタイ (necktie)' },
  { kana: 'ノ', romaji: 'no', row: 'n', mnemonic: 'A single "no" slash — nope.', example: 'ノート (notebook)' },

  // H row
  { kana: 'ハ', romaji: 'ha', row: 'h', mnemonic: 'Two strokes laughing "ha ha".', example: 'ハンバーガー (hamburger)' },
  { kana: 'ヒ', romaji: 'hi', row: 'h', mnemonic: 'A "heel" of a boot.', example: 'コーヒー (coffee)' },
  { kana: 'フ', romaji: 'fu', row: 'h', mnemonic: 'Mount "Fu"-ji, a single slope.', example: 'フォーク (fork)' },
  { kana: 'ヘ', romaji: 'he', row: 'h', mnemonic: 'A "he"-adland / hill on a map. Same as hiragana へ.', example: 'ヘリコプター (helicopter)' },
  { kana: 'ホ', romaji: 'ho', row: 'h', mnemonic: 'A "ho"-ly cross with two supports.', example: 'ホテル (hotel)' },

  // M row
  { kana: 'マ', romaji: 'ma', row: 'm', mnemonic: 'A "ma"-p marker / checkmark.', example: 'トマト (tomato)' },
  { kana: 'ミ', romaji: 'mi', row: 'm', mnemonic: 'Three lines = "mi" = 3 (mittsu).', example: 'ミルク (milk)' },
  { kana: 'ム', romaji: 'mu', row: 'm', mnemonic: 'A cow saying "muuu".', example: 'ゲーム (game)' },
  { kana: 'メ', romaji: 'me', row: 'm', mnemonic: 'An "X" marks where "me" stand.', example: 'メニュー (menu)' },
  { kana: 'モ', romaji: 'mo', row: 'm', mnemonic: 'A fish hook catching "mo"-re fish.', example: 'メモ (memo)' },

  // Y row
  { kana: 'ヤ', romaji: 'ya', row: 'y', mnemonic: 'A "ya"-cht with a sail.', example: 'タイヤ (tire)' },
  { kana: 'ユ', romaji: 'yu', row: 'y', mnemonic: 'A "U"-turn channel — "yu".', example: 'ユーモア (humor)' },
  { kana: 'ヨ', romaji: 'yo', row: 'y', mnemonic: 'An "E" with no middle — "yo" three shelves.', example: 'ヨガ (yoga)' },

  // R row
  { kana: 'ラ', romaji: 'ra', row: 'r', mnemonic: 'A "ra"-bbit ear over a line.', example: 'ラーメン (ramen)' },
  { kana: 'リ', romaji: 'ri', row: 'r', mnemonic: 'Two "ree"-ds standing in water.', example: 'リボン (ribbon)' },
  { kana: 'ル', romaji: 'ru', row: 'r', mnemonic: 'A "roo"-t curling up.', example: 'ルール (rule)' },
  { kana: 'レ', romaji: 're', row: 'r', mnemonic: 'A single "ray" / ramp.', example: 'レモン (lemon)' },
  { kana: 'ロ', romaji: 'ro', row: 'r', mnemonic: 'A "ro"-bot square mouth.', example: 'ロボット (robot)' },

  // W row + N
  { kana: 'ワ', romaji: 'wa', row: 'w', mnemonic: 'A "wa"-tering can opening.', example: 'ワイン (wine)' },
  { kana: 'ヲ', romaji: 'wo', row: 'w', mnemonic: 'Rare particle "wo" — like a flag waving.', example: '(particle を)' },
  { kana: 'ン', romaji: 'n', row: 'w', mnemonic: 'A single hook — final "n" sound (vs ソ which dips down).', example: 'パン (bread)' },
]

// Dakuten / handakuten (voiced) characters — advanced unit.
export const DAKUTEN = [
  { kana: 'ガ', romaji: 'ga', row: 'g', mnemonic: 'カ + " = ga.', example: 'ガラス (glass)' },
  { kana: 'ギ', romaji: 'gi', row: 'g', mnemonic: 'キ + " = gi.', example: 'ギター (guitar)' },
  { kana: 'グ', romaji: 'gu', row: 'g', mnemonic: 'ク + " = gu.', example: 'グラム (gram)' },
  { kana: 'ゲ', romaji: 'ge', row: 'g', mnemonic: 'ケ + " = ge.', example: 'ゲーム (game)' },
  { kana: 'ゴ', romaji: 'go', row: 'g', mnemonic: 'コ + " = go.', example: 'ゴルフ (golf)' },
  { kana: 'ザ', romaji: 'za', row: 'z', mnemonic: 'サ + " = za.', example: 'ピザ (pizza)' },
  { kana: 'ジ', romaji: 'ji', row: 'z', mnemonic: 'シ + " = ji.', example: 'ジュース (juice)' },
  { kana: 'ズ', romaji: 'zu', row: 'z', mnemonic: 'ス + " = zu.', example: 'チーズ (cheese)' },
  { kana: 'ゼ', romaji: 'ze', row: 'z', mnemonic: 'セ + " = ze.', example: 'ゼロ (zero)' },
  { kana: 'ゾ', romaji: 'zo', row: 'z', mnemonic: 'ソ + " = zo.', example: 'ゾーン (zone)' },
  { kana: 'ダ', romaji: 'da', row: 'd', mnemonic: 'タ + " = da.', example: 'サラダ (salad)' },
  { kana: 'ヂ', romaji: 'ji', row: 'd', mnemonic: 'チ + " = ji (rare).', example: '(rare)' },
  { kana: 'ヅ', romaji: 'zu', row: 'd', mnemonic: 'ツ + " = zu (rare).', example: '(rare)' },
  { kana: 'デ', romaji: 'de', row: 'd', mnemonic: 'テ + " = de.', example: 'デザート (dessert)' },
  { kana: 'ド', romaji: 'do', row: 'd', mnemonic: 'ト + " = do.', example: 'ドア (door)' },
  { kana: 'バ', romaji: 'ba', row: 'b', mnemonic: 'ハ + " = ba.', example: 'バス (bus)' },
  { kana: 'ビ', romaji: 'bi', row: 'b', mnemonic: 'ヒ + " = bi.', example: 'ビール (beer)' },
  { kana: 'ブ', romaji: 'bu', row: 'b', mnemonic: 'フ + " = bu.', example: 'ブログ (blog)' },
  { kana: 'ベ', romaji: 'be', row: 'b', mnemonic: 'ヘ + " = be.', example: 'ベッド (bed)' },
  { kana: 'ボ', romaji: 'bo', row: 'b', mnemonic: 'ホ + " = bo.', example: 'ボール (ball)' },
  { kana: 'パ', romaji: 'pa', row: 'p', mnemonic: 'ハ + ° = pa.', example: 'パン (bread)' },
  { kana: 'ピ', romaji: 'pi', row: 'p', mnemonic: 'ヒ + ° = pi.', example: 'ピアノ (piano)' },
  { kana: 'プ', romaji: 'pu', row: 'p', mnemonic: 'フ + ° = pu.', example: 'プール (pool)' },
  { kana: 'ペ', romaji: 'pe', row: 'p', mnemonic: 'ヘ + ° = pe.', example: 'ペン (pen)' },
  { kana: 'ポ', romaji: 'po', row: 'p', mnemonic: 'ホ + ° = po.', example: 'ポスト (post)' },
]

export const ALL_CHARACTERS = [...CHARACTERS, ...DAKUTEN]

// Quick lookup by kana.
export const BY_KANA = ALL_CHARACTERS.reduce((acc, c) => {
  acc[c.kana] = c
  return acc
}, {})
