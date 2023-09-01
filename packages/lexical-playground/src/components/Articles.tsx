import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getArticle } from "../services/articleBySlug";

interface IArticle {
    _id: string;
    slug: string;
    title: string;
    ctaLink: string;
}


function ArticleComponent() {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<IArticle | null>(null);

    useEffect(() => {
        fetchArticle();  
    }, [slug]); 

    async function fetchArticle() { 
        if(slug){
            const response: IArticle = await getArticle(slug);
            setArticle(response);
        } 
    }

    return (
        <div>
            <p>
                { article && article.title }
            </p>
            <div>
                <a href={ article?.ctaLink }> BUTTON </a>
            </div>
        </div>
    );
}

export default ArticleComponent;
