import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { getIcons } from "../services/icons";

interface IICons {
    _id:string;
    name:string;
    imagePath:string;
}

interface Props{
    control:any;
    fieldName:string;
    defaultValue:string;
}


const CategoryType:React.FC<Props> = ({ control, fieldName, defaultValue }) => {

    const [ categories, setCategories  ] = useState<IICons[]>([]);

    useEffect(()=>{
        fetchCategories()
    }, [])

    async function fetchCategories(){
       const response = await getIcons()
       setCategories(response)
    }

    return(
        <Controller
            control={control}
            name={fieldName}
            defaultValue={defaultValue}
            render={({ field })=>(
                <select {...field}>
                    { categories.map((category:IICons)=>(
                        <option key={category._id} value={category._id}>
                            { category.name }
                        </option>
                    ))}
                </select>
            )}
        />
    )
}

export default CategoryType