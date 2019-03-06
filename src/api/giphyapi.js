import mockResponse from "../constants/mockResponse";
import mockSoftwareResponse from "../constants/mockSoftwareResponse";
import mockByID from "../constants/mockByID";
const giphyEndPoint = "http://api.giphy.com/v1/gifs/search?api_key";
const apiKey = "=dc6zaTOxFJmzC";
const giphyIdsEndpoint = "http://api.giphy.com/v1/gifs/";
//&q=car&limit=25&offset=2
//http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=car&limit=25&offset=2

class GiphyApi {
  static getImages(offset = 2, limit = 25, text) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Object.assign([], mockResponse));
      }, 120);
    });

    //      return fetch(giphyEndPoint + apiKey + "&q=" + text + "&limit=" + limit + "&offset=" + offset);
  }

  static geImagesByIds(ids) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Object.assign({}, mockByID));
      }, 120);
    });

    /*let _fetchColl =[];
  ids.map( i => {
    let c= fetch(giphyIdsEndpoint +  i + "?api_key"+ apiKey).then(function(response){
      return response;
    })
  _fetchColl.push(c);
  });
    
  Promise.all(_fetchColl).then(function(values){
    
    console.log(values);
    
});*/
  }
}

export default GiphyApi;
