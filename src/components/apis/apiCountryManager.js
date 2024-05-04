const API = 'https://restcountries.com/v3.1/name/';

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