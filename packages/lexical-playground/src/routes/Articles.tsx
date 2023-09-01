import { useState, useEffect } from "react";
import { getArticles } from "../services/Article";

interface Article{
    title:string,
}

function Articles(){

    const [ articles, setArticles ] = useState<Article[]>([]);

    useEffect(()=>{
        fetchArticles()
    }, [])

    async function fetchArticles(){
        const response = await getArticles()
        setArticles(response)
    }

    return(
        <div>
            { articles.map(article =>(
                <div>
                    <p> { article.title } </p>
                    <a href="/">EDIT</a>
                </div>
            )) }
        </div>
    )
}

export default Articles