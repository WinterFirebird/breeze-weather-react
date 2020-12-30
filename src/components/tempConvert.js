/**
 * convert kelvin to celcius or fahrenheit, returns a rounded integer
 * @param {number} temp
 * @param {string} to
 */
export const convertKelvinTo = (temp, to) => {
  if (to === 'c') {
    const newTemp = Math.round(temp - 273.15);
    return newTemp;
  }
  if (to === 'f') {
    const newTemp = Math.round((temp - 273.15) * (9 / 5) + 32);
    return newTemp;
  } else return temp;
};
