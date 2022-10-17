import axios from "axios";
import { UnSplashAPI } from "../../constants/apiKeys";

export const GetPhotos = async (query) => {
  const URL = `https://api.unsplash.com/search/photos?client_id=${UnSplashAPI}&page=1&query=${query}`;
  const result = await axios.get(URL);
  return result;
};


//J2O_Iz4bx4GwvYGbyX1K9ncPGWzyZOVvLrZ5AJqPrDQ => access key
//eXXyRqt89YEw1RmhIZL0fMpqaZlzP7uQMC9d8e4OivU => secret key
