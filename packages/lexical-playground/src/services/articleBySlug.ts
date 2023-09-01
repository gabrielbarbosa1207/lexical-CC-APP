import axios, { AxiosResponse } from "axios";

const articlesAPI = axios.create({ baseURL:"http://localhost:80/new/articles/" })

async function getArticle(slug:string){
    const response: AxiosResponse = await articlesAPI.get(`${slug}`);
    return response.data
}

export{
    getArticle
}