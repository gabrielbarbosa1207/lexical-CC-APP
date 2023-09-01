import axios, { AxiosResponse} from "axios"

interface IIcon {
    _id:string;
    name:string;
    imagePath:string;
    description:string;
}

const iconApi = axios.create({ baseURL:"http://localhost:80/icons"});

async function getIcons(): Promise<IIcon[]>{
    const response: AxiosResponse<IIcon[]> = await iconApi.get("/");
    return response.data
}

export{
    getIcons
}