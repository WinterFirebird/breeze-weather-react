import Spacetime from 'spacetime';

/**
 * returns formatted date 'n' days from now
 * @param {number} n
 */
export const dateDaysFromNow = (n) => {
  const nDaysAfter = Spacetime.now().add(n, 'day').format('{day} {date}');
  return nDaysAfter;
};

/**
 * returns formatted hours 'n' hours from now
 * @param {number} n
 */
export const hoursHoursFromNow = (n) => {
  const nHoursAfter = Spacetime.now().add(n, 'hour').format('{hour} {ampm}');
  return nHoursAfter;
};

/**
 * converts epoch time to formatted hours and minutes
 * @param {number} epochTime
 */
export const epochTimeToLocalTime = (epochTime) => {
  const localFromEpoch = Spacetime(epochTime * 1000).format('{time}');
  return localFromEpoch;
};
