module.exports = {
  asTheCrowFlies
};

/**
 * Takes an Array of objects with `latitude` and `longitude`
 * properties, and returns an Array of objects that are within
 * `miles` of the `origin`.
 * If `filterDesLoc` is `true`, will check the array of locations
 * in the `desired_locations` property of each object in the `array`.
 * @param {Array} array
 * @param {Number} originLat Origin latitude
 * @param {Number} originLon Origin longitude
 * @param {Number} miles Max distance in miles between points
 * @param {Boolean} filterDesLoc Filter by desired location
 */
function asTheCrowFlies(array, originLat, originLon, miles, filterDesLoc) {
  const toKilometer = miles * 1609.344;

  return array.flatMap(item => {
    if (item.lat && item.lon) {
      const distance = haversineFormula(
        item.lat,
        item.lon,
        originLat,
        originLon
      );
      if (distance <= toKilometer) {
        return [{ ...item, distance }];
      } else if (
        filterDesLoc &&
        item.desired_locations &&
        item.desired_locations.length
      ) {
        let match = false;
        const desiredDistance = item.desired_locations.map(item => {
          const distance = haversineFormula(
            item.lat,
            item.lon,
            originLat,
            originLon
          );
          if (distance <= toKilometer) {
            match = true;
          }
          return { ...item, distance };
        });
        return match ? [{ ...item, desired_locations: desiredDistance }] : [];
      }
      return []; // eliminates the `item` from returned array
    }
  });
}

/**
 * Returns the distance in kilometers.
 * This uses the ‘haversine’ formula to calculate
 * the geographic distance between two points – that is,
 * the straight-line distance over the earth’s surface.
 * https://www.movable-type.co.uk/scripts/latlong.html
 * @param {Number} lat1 Coordinate One Latitude
 * @param {Number} lon1 Coordinate One Longitude
 * @param {Number} lat2 Coordinate Two Latitude
 * @param {Number} lon2 Coordinate Two Longitude
 */
function haversineFormula(lat1, lon1, lat2, lon2) {
  let R = 6371e3; // Earth's radius in metres
  let φ1 = toRadians(lat1);
  let φ2 = toRadians(lat2);
  let Δφ = toRadians(lat2 - lat1);
  let Δλ = toRadians(lon2 - lon1);

  let a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
