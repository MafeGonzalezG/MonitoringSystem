const API = 'https://restcountries.com/v3.1/name/';
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
  static async fetchInfo(country) {
    try {
      const code = await fetch(`${API}${country}`);
      const countryCode = await code.json();
      return countryCode[0];
    } catch (error) {
      console.log('Error occurred:', error);
    }
  }
}
export default ApiManager;