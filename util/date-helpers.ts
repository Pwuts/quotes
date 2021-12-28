const days = {
  0: 'zondag',
  1: 'maandag',
  2: 'dinsdag',
  3: 'woensdag',
  4: 'donderdag',
  5: 'vrijdag',
  6: 'zaterdag',
};

const months = {
  1: 'januari',
  2: 'februari',
  3: 'maart',
  4: 'april',
  5: 'mei',
  6: 'juni',
  7: 'juli',
  8: 'augustus',
  9: 'september',
  10: 'oktober',
  11: 'november',
  12: 'december',
};

const dayDuration = 24*3600*1000;
const weekDuration = 7*dayDuration;
const yearDuration = 365*dayDuration;

export function formatDate(date: Date | string): string
{
  if (typeof date == 'string') {
    date = new Date(date);
  }
  const now = new Date(), nowT = now.getTime(), dateT = date.getTime();

  if (nowT - dateT < dayDuration) {
    return now.getDay() == date.getDay() ? 'vandaag' : 'gisteren';
  }
  else if (nowT - dateT < weekDuration) {
    return days[date.getDay()];
  }
  else if (now.getFullYear() == date.getFullYear() || nowT - dateT < yearDuration/2) {
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }
  else {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}
