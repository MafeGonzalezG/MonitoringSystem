/**
 * Fetch all features from a URL that supports pagination
 * @param {string} url - The URL to fetch features from.
 * @returns {Promise} - A promise that resolves to a GeoJSON FeatureCollection.
 * @example
 * fetchAllFeatures("https://api.url.com/features");
 * @example
 * fetchAllFeatures("https://api.url.com/features?query=something");
 */
async function fetchAllFeatures(url) {
    const allFeatures = [];
    let offset = 0;
    const limit = 1000; // Number of records to fetch per request
  
    while (true) {
      const queryUrl = `${url}&resultOffset=${offset}&resultRecordCount=${limit}`;
      const response = await fetch(queryUrl);
      const data = await response.json();
      allFeatures.push(...data.features);
  
      if (data.features.length < limit) {
        // If fewer features are returned than the limit, we have fetched all records
        break;
      }
  
      offset += limit;
    }
  
    return {
      type: "FeatureCollection",
      features: allFeatures,
    };
  }
export default fetchAllFeatures;