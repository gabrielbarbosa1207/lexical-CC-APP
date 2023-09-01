import axios from "axios";

interface IArticles{
    _id:string;
    title:string;
    slug:string;
    cardImage:string;
    ctaLink:string
}

const articlesAPI = axios.create({ baseURL:"http://localhost:80/new/articles/all" })

async function getArticles(): Promise<IArticles[]>{
    const response = await articlesAPI.get<IArticles[]>("/")
    return response.data
}

export {
    getArticles
}