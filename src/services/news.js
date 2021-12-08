import axios from "axios";

class NewsManager {
  constructor(key) {
    this.key = key;
    this.baseURL = "https://newsapi.org/v2";
  }

  async fetchData(query) {
    const params = {
      country: "kr",
      ...(query !== "all" && { category: query }),
      apikey: this.key,
    };

    const ax = axios.create({
      baseURL: this.baseURL,
      params: params,
    });

    const response = await ax.get("/top-headlines");

    return response.data;
  }
}

export default NewsManager;
