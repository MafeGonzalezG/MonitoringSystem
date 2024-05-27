/**
 * Api manager for country information api.
 *
 * @class
 * @returns {json} A json containing information of the country such as name, flag, currency,etc.
 *
 * @example
 * // When called it fetches information about a country, and returns the country information.
 * ApiManager.fetchInfo('colombia');
 */
class ApiManager {
  static async fetchSuggestions(input){
    try {
      const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${input}&proximity=ip&access_token=pk.eyJ1IjoiYWNtb3JhIiwiYSI6ImNsdHlnbGszMDBpMGUyaG8wMHNzd3NvcTAifQ.Ger587FmqVP5qcFPz7mwqg`);
      const data = await response.json();
      return data.features // Adjust this based on your API response structure
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };
  }

export default ApiManager;