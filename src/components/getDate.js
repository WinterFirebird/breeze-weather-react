import Spacetime from 'spacetime';

/**
 * returns date 'n' days from now
 * @param {number} n 
 */
export const dateDaysFromNow = (n) => {
  const nDaysAfter = Spacetime.now().add(n, 'day').format('{day} {date}');
  return(nDaysAfter)
}

export const hoursHoursFromNow = (n) => {
  const nHoursAfter = Spacetime.now().add(n, 'hour').format('{hour} {ampm}');
  return(nHoursAfter)
}