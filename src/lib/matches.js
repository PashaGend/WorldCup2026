// Exact-score bonus points, by knockout stage (default applies to group stage, 32 האחרונות)
const EXACT_SCORE_BONUS_BY_STAGE = { 'שמינית גמר': 5, 'רבע גמר': 10, 'מקום 3': 12, 'חצי גמר': 15, 'גמר': 20 }
export function getExactScoreBonus(stage) {
  return EXACT_SCORE_BONUS_BY_STAGE[stage] || 3
}

// Parse prediction stored as "outcome" or "outcome:homeScore:awayScore"
export function parsePrediction(p) {
  if (!p) return { outcome: null, homeScore: null, awayScore: null }
  const parts = p.split(':')
  return {
    outcome: parts[0] || null,
    homeScore: parts.length > 1 ? parseInt(parts[1]) : null,
    awayScore: parts.length > 2 ? parseInt(parts[2]) : null,
  }
}

// English name (from worldcup26.ir API) → Hebrew name
export const TEAM_EN_TO_HE = {
  'Mexico': 'מקסיקו', 'South Africa': 'דרום אפריקה', 'South Korea': 'קוריאה הדרומית', 'Czech Republic': "צ'כיה",
  'Canada': 'קנדה', 'Bosnia and Herzegovina': 'בוסניה', 'Qatar': 'קטאר', 'Switzerland': 'שווייץ',
  'Brazil': 'ברזיל', 'Morocco': 'מרוקו', 'Haiti': 'האיטי', 'Scotland': 'סקוטלנד',
  'United States': 'ארצות הברית', 'Paraguay': 'פרגוואי', 'Australia': 'אוסטרליה', 'Turkey': 'טורקיה',
  'Germany': 'גרמניה', 'Curaçao': 'קוראסאו', 'Ivory Coast': 'חוף השנהב', 'Ecuador': 'אקוודור',
  'Netherlands': 'הולנד', 'Japan': 'יפן', 'Sweden': 'שוודיה', 'Tunisia': 'תוניסיה',
  'Belgium': 'בלגיה', 'Egypt': 'מצרים', 'Iran': 'איראן', 'New Zealand': 'ניו זילנד',
  'Spain': 'ספרד', 'Cape Verde': 'כף ורדה', 'Saudi Arabia': 'ערב הסעודית', 'Uruguay': 'אורוגוואי',
  'France': 'צרפת', 'Senegal': 'סנגל', 'Iraq': 'עיראק', 'Norway': 'נורווגיה',
  'Argentina': 'ארגנטינה', 'Algeria': "אלג'יריה", 'Austria': 'אוסטריה', 'Jordan': 'ירדן',
  'Portugal': 'פורטוגל', 'Democratic Republic of the Congo': 'קונגו DR', 'Uzbekistan': 'אוזבקיסטן', 'Colombia': 'קולומביה',
  'England': 'אנגליה', 'Croatia': 'קרואטיה', 'Ghana': 'גאנה', 'Panama': 'פנמה',
}


export const FLAG_CODE = {
  'מקסיקו': 'mx', 'דרום אפריקה': 'za', 'קוריאה הדרומית': 'kr', "צ'כיה": 'cz',
  'קנדה': 'ca', 'בוסניה': 'ba', 'קטאר': 'qa', 'שווייץ': 'ch',
  'ברזיל': 'br', 'מרוקו': 'ma', 'האיטי': 'ht', 'סקוטלנד': 'gb-sct',
  'ארצות הברית': 'us', 'פרגוואי': 'py', 'אוסטרליה': 'au', 'טורקיה': 'tr',
  'גרמניה': 'de', 'קוראסאו': 'cw', 'חוף השנהב': 'ci', 'אקוודור': 'ec',
  'הולנד': 'nl', 'יפן': 'jp', 'שוודיה': 'se', 'תוניסיה': 'tn',
  'בלגיה': 'be', 'מצרים': 'eg', 'איראן': 'ir', 'ניו זילנד': 'nz',
  'ספרד': 'es', 'כף ורדה': 'cv', 'ערב הסעודית': 'sa', 'אורוגוואי': 'uy',
  'צרפת': 'fr', 'סנגל': 'sn', 'עיראק': 'iq', 'נורווגיה': 'no',
  'ארגנטינה': 'ar', "אלג'יריה": 'dz', 'אוסטריה': 'at', 'ירדן': 'jo',
  'פורטוגל': 'pt', 'קונגו DR': 'cd', 'אוזבקיסטן': 'uz', 'קולומביה': 'co',
  'אנגליה': 'gb-eng', 'קרואטיה': 'hr', 'גאנה': 'gh', 'פנמה': 'pa',
}

// All times in Israel (UTC+3) = ET + 7h
// Source: ESPN official schedule
export const MATCHES = [
  // ── בית 1: מקסיקו, דרום אפריקה, קוריאה הדרומית, צ'כיה ──
  { id: 1,  home: 'מקסיקו',         away: 'דרום אפריקה',    date: '2026-06-11T22:00', group: '1' },
  { id: 2,  home: 'קוריאה הדרומית', away: "צ'כיה",           date: '2026-06-12T05:00', group: '1' },
  { id: 3,  home: "צ'כיה",          away: 'דרום אפריקה',    date: '2026-06-18T19:00', group: '1' },
  { id: 4,  home: 'מקסיקו',         away: 'קוריאה הדרומית', date: '2026-06-19T04:00', group: '1' },
  { id: 5,  home: 'דרום אפריקה',    away: 'קוריאה הדרומית', date: '2026-06-25T04:00', group: '1' },
  { id: 6,  home: "צ'כיה",          away: 'מקסיקו',          date: '2026-06-25T04:00', group: '1' },

  // ── בית 2: קנדה, בוסניה, קטאר, שווייץ ──
  { id: 7,  home: 'קנדה',   away: 'בוסניה', date: '2026-06-12T22:00', group: '2' },
  { id: 8,  home: 'קטאר',   away: 'שווייץ', date: '2026-06-13T22:00', group: '2' },
  { id: 9,  home: 'שווייץ', away: 'בוסניה', date: '2026-06-18T22:00', group: '2' },
  { id: 10, home: 'קנדה',   away: 'קטאר',   date: '2026-06-19T01:00', group: '2' },
  { id: 11, home: 'שווייץ', away: 'קנדה',   date: '2026-06-24T22:00', group: '2' },
  { id: 12, home: 'בוסניה', away: 'קטאר',   date: '2026-06-24T22:00', group: '2' },

  // ── בית 3: ברזיל, מרוקו, האיטי, סקוטלנד ──
  { id: 13, home: 'ברזיל',   away: 'מרוקו',   date: '2026-06-14T01:00', group: '3' },
  { id: 14, home: 'האיטי',   away: 'סקוטלנד', date: '2026-06-14T04:00', group: '3' },
  { id: 15, home: 'סקוטלנד', away: 'מרוקו',   date: '2026-06-20T01:00', group: '3' },
  { id: 16, home: 'ברזיל',   away: 'האיטי',   date: '2026-06-20T04:00', group: '3' },
  { id: 17, home: 'סקוטלנד', away: 'ברזיל',   date: '2026-06-25T01:00', group: '3' },
  { id: 18, home: 'מרוקו',   away: 'האיטי',   date: '2026-06-25T01:00', group: '3' },

  // ── בית 4: ארצות הברית, פרגוואי, אוסטרליה, טורקיה ──
  { id: 19, home: 'ארצות הברית', away: 'פרגוואי',  date: '2026-06-13T04:00', group: '4' },
  { id: 20, home: 'אוסטרליה',    away: 'טורקיה',   date: '2026-06-14T07:00', group: '4' },
  { id: 21, home: 'ארצות הברית', away: 'אוסטרליה', date: '2026-06-19T22:00', group: '4' },
  { id: 22, home: 'טורקיה',      away: 'פרגוואי',  date: '2026-06-20T07:00', group: '4' },
  { id: 23, home: 'טורקיה',      away: 'ארצות הברית', date: '2026-06-26T05:00', group: '4' },
  { id: 24, home: 'פרגוואי',     away: 'אוסטרליה', date: '2026-06-26T05:00', group: '4' },

  // ── בית 5: גרמניה, קוראסאו, חוף השנהב, אקוודור ──
  { id: 25, home: 'גרמניה',    away: 'קוראסאו',   date: '2026-06-14T20:00', group: '5' },
  { id: 26, home: 'חוף השנהב', away: 'אקוודור',   date: '2026-06-15T02:00', group: '5' },
  { id: 27, home: 'גרמניה',    away: 'חוף השנהב', date: '2026-06-20T23:00', group: '5' },
  { id: 28, home: 'אקוודור',   away: 'קוראסאו',   date: '2026-06-21T03:00', group: '5' },
  { id: 29, home: 'אקוודור',   away: 'גרמניה',    date: '2026-06-25T23:00', group: '5' },
  { id: 30, home: 'קוראסאו',   away: 'חוף השנהב', date: '2026-06-25T23:00', group: '5' },

  // ── בית 6: הולנד, יפן, שוודיה, תוניסיה ──
  { id: 31, home: 'הולנד',   away: 'יפן',     date: '2026-06-14T23:00', group: '6' },
  { id: 32, home: 'שוודיה',  away: 'תוניסיה', date: '2026-06-15T05:00', group: '6' },
  { id: 33, home: 'תוניסיה', away: 'יפן',     date: '2026-06-21T07:00', group: '6' },
  { id: 34, home: 'הולנד',   away: 'שוודיה',  date: '2026-06-20T20:00', group: '6' },
  { id: 35, home: 'יפן',     away: 'שוודיה',  date: '2026-06-26T02:00', group: '6' },
  { id: 36, home: 'תוניסיה', away: 'הולנד',   date: '2026-06-26T02:00', group: '6' },

  // ── בית 7: בלגיה, מצרים, איראן, ניו זילנד ──
  { id: 37, home: 'איראן',    away: 'ניו זילנד', date: '2026-06-16T04:00', group: '7' },
  { id: 38, home: 'בלגיה',    away: 'מצרים',    date: '2026-06-15T22:00', group: '7' },
  { id: 39, home: 'בלגיה',    away: 'איראן',    date: '2026-06-21T22:00', group: '7' },
  { id: 40, home: 'ניו זילנד', away: 'מצרים',   date: '2026-06-22T04:00', group: '7' },
  { id: 41, home: 'מצרים',    away: 'איראן',    date: '2026-06-27T06:00', group: '7' },
  { id: 42, home: 'ניו זילנד', away: 'בלגיה',   date: '2026-06-27T06:00', group: '7' },

  // ── בית 8: ספרד, כף ורדה, ערב הסעודית, אורוגוואי ──
  { id: 43, home: 'ספרד',         away: 'כף ורדה',      date: '2026-06-15T19:00', group: '8' },
  { id: 44, home: 'ערב הסעודית',  away: 'אורוגוואי',    date: '2026-06-16T01:00', group: '8' },
  { id: 45, home: 'ספרד',         away: 'ערב הסעודית',  date: '2026-06-21T19:00', group: '8' },
  { id: 46, home: 'אורוגוואי',    away: 'כף ורדה',      date: '2026-06-22T01:00', group: '8' },
  { id: 47, home: 'כף ורדה',      away: 'ערב הסעודית',  date: '2026-06-27T03:00', group: '8' },
  { id: 48, home: 'אורוגוואי',    away: 'ספרד',         date: '2026-06-27T03:00', group: '8' },

  // ── בית 9: צרפת, סנגל, עיראק, נורווגיה ──
  { id: 49, home: 'צרפת',    away: 'סנגל',    date: '2026-06-16T22:00', group: '9' },
  { id: 50, home: 'עיראק',   away: 'נורווגיה', date: '2026-06-17T01:00', group: '9' },
  { id: 51, home: 'צרפת',    away: 'עיראק',   date: '2026-06-23T00:00', group: '9' },
  { id: 52, home: 'נורווגיה', away: 'סנגל',   date: '2026-06-23T03:00', group: '9' },
  { id: 53, home: 'נורווגיה', away: 'צרפת',   date: '2026-06-26T22:00', group: '9' },
  { id: 54, home: 'סנגל',    away: 'עיראק',   date: '2026-06-26T22:00', group: '9' },

  // ── בית 10: ארגנטינה, אלג'יריה, אוסטריה, ירדן ──
  { id: 55, home: 'אוסטריה',  away: 'ירדן',       date: '2026-06-17T07:00', group: '10' },
  { id: 56, home: 'ארגנטינה', away: "אלג'יריה",   date: '2026-06-17T04:00', group: '10' },
  { id: 57, home: 'ארגנטינה', away: 'אוסטריה',    date: '2026-06-22T20:00', group: '10' },
  { id: 58, home: 'ירדן',     away: "אלג'יריה",   date: '2026-06-23T06:00', group: '10' },
  { id: 59, home: "אלג'יריה", away: 'אוסטריה',    date: '2026-06-28T05:00', group: '10' },
  { id: 60, home: 'ירדן',     away: 'ארגנטינה',   date: '2026-06-28T05:00', group: '10' },

  // ── בית 11: פורטוגל, קונגו DR, אוזבקיסטן, קולומביה ──
  { id: 61, home: 'פורטוגל',   away: 'קונגו DR',    date: '2026-06-17T20:00', group: '11' },
  { id: 62, home: 'אוזבקיסטן', away: 'קולומביה',   date: '2026-06-18T05:00', group: '11' },
  { id: 63, home: 'פורטוגל',   away: 'אוזבקיסטן',  date: '2026-06-23T20:00', group: '11' },
  { id: 64, home: 'קולומביה',  away: 'קונגו DR',    date: '2026-06-24T05:00', group: '11' },
  { id: 65, home: 'קולומביה',  away: 'פורטוגל',    date: '2026-06-28T02:30', group: '11' },
  { id: 66, home: 'קונגו DR',  away: 'אוזבקיסטן',  date: '2026-06-28T02:30', group: '11' },

  // ── בית 12: אנגליה, קרואטיה, גאנה, פנמה ──
  { id: 67, home: 'אנגליה',  away: 'קרואטיה', date: '2026-06-17T23:00', group: '12' },
  { id: 68, home: 'גאנה',    away: 'פנמה',    date: '2026-06-18T02:00', group: '12' },
  { id: 69, home: 'אנגליה',  away: 'גאנה',    date: '2026-06-23T23:00', group: '12' },
  { id: 70, home: 'פנמה',    away: 'קרואטיה', date: '2026-06-24T02:00', group: '12' },
  { id: 71, home: 'פנמה',    away: 'אנגליה',  date: '2026-06-28T00:00', group: '12' },
  { id: 72, home: 'קרואטיה', away: 'גאנה',    date: '2026-06-28T00:00', group: '12' },

  // ── 32 האחרונות ──
  { id: 73,  home: 'דרום אפריקה',  away: 'קנדה',       date: '2026-06-28T22:00', group: '', stage: '32 האחרונות' },
  { id: 76,  home: 'ברזיל',         away: 'יפן',         date: '2026-06-29T20:00', group: '', stage: '32 האחרונות' },
  { id: 74,  home: 'גרמניה',        away: 'פרגוואי',    date: '2026-06-29T23:30', group: '', stage: '32 האחרונות' },
  { id: 75,  home: 'הולנד',         away: 'מרוקו',       date: '2026-06-30T04:00', group: '', stage: '32 האחרונות' },
  { id: 78,  home: 'חוף השנהב',     away: 'נורווגיה',   date: '2026-06-30T20:00', group: '', stage: '32 האחרונות' },
  { id: 77,  home: 'צרפת',          away: 'שוודיה',      date: '2026-07-01T00:00', group: '', stage: '32 האחרונות' },
  { id: 79,  home: 'מקסיקו',        away: 'אקוודור',    date: '2026-07-01T04:00', group: '', stage: '32 האחרונות' },
  { id: 80,  home: 'אנגליה',        away: 'קונגו DR',   date: '2026-07-01T19:00', group: '', stage: '32 האחרונות' },
  { id: 82,  home: 'בלגיה',         away: 'סנגל',        date: '2026-07-01T23:00', group: '', stage: '32 האחרונות' },
  { id: 81,  home: 'ארצות הברית',  away: 'בוסניה',      date: '2026-07-02T03:00', group: '', stage: '32 האחרונות' },
  { id: 84,  home: 'ספרד',          away: 'אוסטריה',    date: '2026-07-02T22:00', group: '', stage: '32 האחרונות' },
  { id: 83,  home: 'פורטוגל',       away: 'קרואטיה',    date: '2026-07-03T02:00', group: '', stage: '32 האחרונות' },
  { id: 85,  home: 'שווייץ',        away: "אלג'יריה",    date: '2026-07-03T06:00', group: '', stage: '32 האחרונות' },
  { id: 88,  home: 'אוסטרליה',      away: 'מצרים',       date: '2026-07-03T21:00', group: '', stage: '32 האחרונות' },
  { id: 86,  home: 'ארגנטינה',      away: 'כף ורדה',    date: '2026-07-04T01:00', group: '', stage: '32 האחרונות' },
  { id: 87,  home: 'קולומביה',      away: 'גאנה',        date: '2026-07-04T04:30', group: '', stage: '32 האחרונות' },

  // ── שמינית גמר ──
  { id: 89,  home: 'פרגוואי',        away: 'צרפת',       date: '2026-07-05T00:00', group: '', stage: 'שמינית גמר' },
  { id: 90,  home: 'קנדה',           away: 'מרוקו',      date: '2026-07-04T20:00', group: '', stage: 'שמינית גמר' },
  { id: 91,  home: 'ברזיל',          away: 'נורווגיה',   date: '2026-07-05T23:00', group: '', stage: 'שמינית גמר' },
  { id: 92,  home: 'מקסיקו',         away: 'אנגליה',     date: '2026-07-06T03:00', group: '', stage: 'שמינית גמר' },
  { id: 93,  home: 'פורטוגל',        away: 'ספרד',        date: '2026-07-06T22:00', group: '', stage: 'שמינית גמר' },
  { id: 94,  home: 'ארצות הברית',   away: 'בלגיה',       date: '2026-07-07T03:00', group: '', stage: 'שמינית גמר' },
  { id: 95,  home: 'ארגנטינה',       away: 'מצרים',       date: '2026-07-07T19:00', group: '', stage: 'שמינית גמר' },
  { id: 96,  home: 'שווייץ',         away: 'קולומביה',    date: '2026-07-07T23:00', group: '', stage: 'שמינית גמר' },

  // ── רבע גמר ──
  { id: 97,  home: 'צרפת',      away: 'מרוקו',   date: '2026-07-09T23:00', group: '', stage: 'רבע גמר' },
  { id: 98,  home: 'ספרד',      away: 'בלגיה',    date: '2026-07-10T22:00', group: '', stage: 'רבע גמר' },
  { id: 99,  home: 'נורווגיה',  away: 'אנגליה',   date: '2026-07-12T00:00', group: '', stage: 'רבע גמר' },
  { id: 100, home: 'ארגנטינה', away: 'שווייץ',    date: '2026-07-12T04:00', group: '', stage: 'רבע גמר' },

  // ── חצי גמר ──
  { id: 101, home: 'צרפת',    away: 'ספרד',      date: '2026-07-14T22:00', group: '', stage: 'חצי גמר' },
  { id: 102, home: 'אנגליה',  away: 'ארגנטינה',  date: '2026-07-15T22:00', group: '', stage: 'חצי גמר' },

  // ── מקום 3 וגמר ──
  { id: 103, home: 'צרפת', away: 'אנגליה',    date: '2026-07-19T00:00', group: '', stage: 'מקום 3' },
  { id: 104, home: 'ספרד', away: 'ארגנטינה',  date: '2026-07-19T22:00', group: '', stage: 'גמר' },
]

export const ADMIN_PASSWORD = '0548009108'
