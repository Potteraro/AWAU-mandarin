// Genera src/content-built.js: textos base con pinyin por carácter.
const { pinyin, customPinyin } = require('pinyin-pro');
const { CATS, TEXTS } = require('./content.js');
const fs = require('fs');
// Correcciones (tonos neutros y lecturas por contexto). Revisadas a mano.
const FIX = {
  '便宜':'pián yi','什么':'shén me','衣服':'yī fu','地方':'dì fang','朋友':'péng you','谢谢':'xiè xie','早上':'zǎo shang',
  '晚上':'wǎn shang','师傅':'shī fu','意思':'yì si','怎么':'zěn me','多少':'duō shao','行李':'xíng li','觉得':'jué de',
  '我们':'wǒ men','你们':'nǐ men','认识':'rèn shi','时候':'shí hou','名字':'míng zi','学习':'xué xí','一点':'yì diǎn',
  '系好':'jì hǎo','待多久':'dāi duō jiǔ','好吃':'hǎo chī','还在':'hái zài','还是':'hái shi','不行':'bù xíng','行吗':'xíng ma',
  '长时间':'cháng shí jiān','正好':'zhèng hǎo','号线':'hào xiàn','发票':'fā piào','看看':'kàn kan','试试':'shì shi',
  '欢迎光临':'huān yíng guāng lín','二楼':'èr lóu','一壶':'yì hú','一份':'yí fèn','一碗':'yì wǎn','一双':'yì shuāng',
  '一辆':'yí liàng','一张':'yì zhāng','一共':'yí gòng','一遍':'yí biàn','一下':'yí xià','一个':'yí gè','觉':'jué',
  '老板':'lǎo bǎn','块':'kuài','几位':'jǐ wèi','这边':'zhè biān','那边':'nà biān','哪国':'nǎ guó','哪里':'nǎ lǐ',
  '出租车':'chū zū chē','空调':'kōng tiáo','转机':'zhuǎn jī','晚点':'wǎn diǎn','地址':'dì zhǐ','堵车':'dǔ chē',
  '的话':'de huà','打表':'dǎ biǎo','刷卡':'shuā kǎ','退换':'tuì huàn','加大号':'jiā dà hào','大号':'dà hào','好啊':'hǎo a',
  '当然':'dāng rán','拍张':'pāi zhāng','扫':'sǎo','码':'mǎ','叫醒':'jiào xǐng','退房':'tuì fáng','预订':'yù dìng',
  '订':'dìng','密码':'mì mǎ','房卡':'fáng kǎ','好的':'hǎo de','给你':'gěi nǐ','给我':'gěi wǒ','卖给你':'mài gěi nǐ',
  '饺子':'jiǎo zi','箱子':'xiāng zi','袋子':'dài zi','只会':'zhǐ huì','巴塞罗那':'bā sài luó nà',
  '妈妈':'mā ma','骂马':'mà mǎ','骑马':'qí mǎ','十四':'shí sì','四十':'sì shí','麻':'má',
  '阿姨':'ā yí','登山包':'dēng shān bāo','好货':'hǎo huò','卖不卖':'mài bu mài','进货':'jìn huò','小伙子':'xiǎo huǒ zi','讲价':'jiǎng jià','哎呀':'āi ya','水壶':'shuǐ hú','生意':'shēng yi','苏州':'sū zhōu','只是':'zhǐ shì','脏':'zāng',
  '买单':'mǎi dān','打包':'dǎ bāo','过敏':'guò mǐn','了':'le',
};
customPinyin(FIX);
const HAN = /\p{Script=Han}/u;
const out = [];
for (const t of TEXTS) {
  const zh = t.lines.map((l) => l[1]).join('\n');
  const es = t.lines.map((l) => (l[0] ? l[0] + ': ' : '') + l[2]);
  const chars = [...zh];
  const arr = pinyin(zh, { type: 'all', toneSandhi: true });
  if (arr.length !== chars.length) throw new Error('len ' + t.id);
  const py = arr.map((o, i) => (HAN.test(chars[i]) ? o.pinyin : null));
  out.push({ id: t.id, cat: t.cat, title: t.title, zh, py, es });
}
fs.writeFileSync(__dirname + '/content-built.js', 'const CATS = ' + JSON.stringify(CATS) + ';\nconst TEXTOS_BASE = ' + JSON.stringify(out) + ';\n');
if (process.argv[2] === '--print') for (const t of out) {
  console.log('\n## ' + t.title);
  const chars = [...t.zh]; let line = '', pl = '';
  chars.forEach((c, i) => { if (c === '\n') { console.log(line + '  |  ' + pl.trim()); line = ''; pl = ''; } else { line += c; if (t.py[i]) pl += t.py[i] + ' '; } });
  console.log(line + '  |  ' + pl.trim());
}

// Historial de huellas: permite actualizar en el móvil los textos base que el usuario no ha editado.
{
  const { textHash } = require('./hash.js');
  const histFile = __dirname + '/base-history.json';
  const hist = fs.existsSync(histFile) ? JSON.parse(fs.readFileSync(histFile, 'utf8')) : {};
  const g = {}; new Function('g', fs.readFileSync(__dirname + '/main-text.js', 'utf8') + '\ng.p = TEXTO_PRINCIPAL;')(g);
  for (const t of [g.p, ...out]) { const h = textHash(t.zh, t.es); hist[t.id] = hist[t.id] || []; if (!hist[t.id].includes(h)) hist[t.id].push(h); }
  fs.writeFileSync(histFile, JSON.stringify(hist, null, 1));
}
