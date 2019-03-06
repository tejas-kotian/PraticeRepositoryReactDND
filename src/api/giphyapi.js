import mockResponse from '../constants/mockResponse';
import mockSoftwareResponse from '../constants/mockSoftwareResponse';

const giphyEndPoint = "http://api.giphy.com/v1/gifs/search?api_key"
const apiKey = '=dc6zaTOxFJmzC'
//&q=car&limit=25&offset=2
//http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=car&limit=25&offset=2

class GiphyApi {
    static getImages(offset = 2, limit = 25, text) {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(Object.assign([], mockResponse));
            }, 120);
          }); 
    
        //return fetch(giphyEndPoint + apiKey + "&q=" + text + "&limit=" + limit + "&offset=" + offset);
    }

    static geOtherImages(offset = 2, limit = 25, text) {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(Object.assign([], mockSoftwareResponse));
            }, 120);
          }); 
    
        //return fetch(giphyEndPoint + apiKey + "&q=" + text + "&limit=" + limit + "&offset=" + offset);
    }

}

export default GiphyApi;