/** Presentation-only examples. Never submit these records to a player repository. */
export interface PreviewServant {
  id: string;
  name: string;
  jp: string;
  className: string;
  rarity: number;
  level: number;
  max: number;
  np: number;
  skills: string;
  accent: string;
  status: string;
}
export const servants: PreviewServant[] = [
  {
    id: "preview-1",
    name: "阿尔托莉雅·潘德拉贡",
    jp: "アルトリア・ペンドラゴン",
    className: "Saber",
    rarity: 5,
    level: 90,
    max: 90,
    np: 2,
    skills: "10 / 10 / 10",
    accent: "blue",
    status: "已校对",
  },
  {
    id: "preview-2",
    name: "玛修·基列莱特",
    jp: "マシュ・キリエライト",
    className: "Shielder",
    rarity: 4,
    level: 80,
    max: 80,
    np: 3,
    skills: "10 / 10 / 10",
    accent: "violet",
    status: "已校对",
  },
  {
    id: "preview-3",
    name: "诸葛孔明〔埃尔梅罗Ⅱ世〕",
    jp: "諸葛孔明〔エルメロイⅡ世〕",
    className: "Caster",
    rarity: 5,
    level: 90,
    max: 90,
    np: 1,
    skills: "10 / 10 / 10",
    accent: "teal",
    status: "已校对",
  },
  {
    id: "preview-4",
    name: "吉尔伽美什",
    jp: "ギルガメッシュ",
    className: "Archer",
    rarity: 5,
    level: 90,
    max: 90,
    np: 1,
    skills: "10 / 6 / 10",
    accent: "gold",
    status: "待校对",
  },
  {
    id: "preview-5",
    name: "库·丘林",
    jp: "クー・フーリン",
    className: "Lancer",
    rarity: 3,
    level: 70,
    max: 70,
    np: 5,
    skills: "6 / 6 / 6",
    accent: "blue",
    status: "已校对",
  },
  {
    id: "preview-6",
    name: "美杜莎",
    jp: "メドゥーサ",
    className: "Rider",
    rarity: 3,
    level: 60,
    max: 70,
    np: 5,
    skills: "4 / 4 / 4",
    accent: "violet",
    status: "已校对",
  },
  {
    id: "preview-7",
    name: "赫拉克勒斯",
    jp: "ヘラクレス",
    className: "Berserker",
    rarity: 4,
    level: 80,
    max: 80,
    np: 2,
    skills: "6 / 6 / 6",
    accent: "rose",
    status: "已校对",
  },
  {
    id: "preview-8",
    name: "阿拉什",
    jp: "アーラシュ",
    className: "Archer",
    rarity: 1,
    level: 60,
    max: 60,
    np: 5,
    skills: "1 / 1 / 10",
    accent: "teal",
    status: "待校对",
  },
];
export const craftEssences = [
  {
    name: "万华镜",
    kind: "概念礼装",
    level: 20,
    detail: "COST 12 · 未满破",
    accent: "violet",
  },
  {
    name: "虚数魔术",
    kind: "概念礼装",
    level: 60,
    detail: "COST 9 · 已满破",
    accent: "blue",
  },
  {
    name: "天之杯",
    kind: "概念礼装",
    level: 20,
    detail: "COST 12 · 未满破",
    accent: "gold",
  },
  {
    name: "龙脉",
    kind: "概念礼装",
    level: 50,
    detail: "COST 5 · 已满破",
    accent: "teal",
  },
];
export const mysticCodes = [
  {
    name: "魔术礼装·迦勒底",
    kind: "御主礼装",
    level: 10,
    detail: "已拥有 · 队伍级配置",
    accent: "blue",
  },
  {
    name: "迦勒底战斗服",
    kind: "御主礼装",
    level: 8,
    detail: "已拥有 · 队伍级配置",
    accent: "teal",
  },
];
