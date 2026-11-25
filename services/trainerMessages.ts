const COMMON_MESSAGES = [
  'お疲れ様でした！今日もえらい！🍫',
  'ナイスファイト！その調子です！',
  '素晴らしい！自分を褒めてあげてね！',
  '毎日の積み重ねが大事。明日も待ってるよ！',
  '運動すると気分もスッキリするね！',
];

export const getEncouragementMessage = (streak: number): string => {
  if (streak === 3) return '3日連続達成！三日坊主卒業おめでとう！🎉';
  if (streak === 7) return '1週間継続！もはや習慣ですね。素晴らしい！🌈';
  if (streak > 0 && streak % 10 === 0) {
    return `${streak}日連続！歴史を刻んでますね！🔥`;
  }

  return COMMON_MESSAGES[Math.floor(Math.random() * COMMON_MESSAGES.length)];
};
