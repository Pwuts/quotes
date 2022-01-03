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
  0: 'januari',
  1: 'februari',
  2: 'maart',
  3: 'april',
  4: 'mei',
  5: 'juni',
  6: 'juli',
  7: 'augustus',
  8: 'september',
  9: 'oktober',
  10: 'november',
  11: 'december',
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
