import axios, { AxiosResponse } from 'axios';

// Define an interface for your data
interface IAuthor {
    _id: string;
    name:string;
    photo:string;
    // Add other properties based on your data structure
    // For example:
    // name: string;
    // description: string;
}

const authorsAPI = axios.create({ baseURL: "http://localhost:80/autores" });

async function getAuthors(): Promise<IAuthor[]> {
    const response: AxiosResponse<IAuthor[]> = await authorsAPI.get('/todos');
    return response.data;
}


export {
    getAuthors
}
