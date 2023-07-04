import axios from 'axios';
import { KEY } from './api-key.js';
axios.defaults.baseURL = 'https://pixabay.com/api/';



 export default async function fetchImages(query, page) {
  return await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
  ).then(response => {
    if (response.status !== 200 || response.data.hits.length === 0 ){
      throw new Error(response.status)
    }
    return response.data;
  })
  
}


