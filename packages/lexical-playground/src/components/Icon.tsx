import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { getIcons } from "../services/icons";
import styled from "styled-components"


interface IIcon {
    _id: string;
    name: string;
    imagePath: string;
    description: string;
}

interface Props {
    control: any;
    fieldName: string;
    defaultIcons?: string[];
    defaultIconDescriptions?: {[iconId: string]: string}
}

// Styled components

// Styled components for the search bar and container
const SearchContainer = styled.div`
    margin-bottom: 20px;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border 0.3s;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
    }

    &::placeholder {
        color: #aaa;
    }
`;


const IconsContainer = styled.div`
    height: 270px; // Set a fixed height. Adjust the value based on your preference.
    overflow-y: auto; // Scrollbar will appear when content exceeds the container's height.

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); // Creates a responsive grid
    gap: 20px;
    border: 1px solid lightgray;
`;


const IconWrapper = styled.div`
    border: 1px solid #eaeaea;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;

    &:hover {
        transform: scale(1.03);
        box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
    }

    input[type="checkbox"] {
        margin-bottom: 10px;
    }

    label {
        margin: 5px 0;

        img {
            width: 40px;
            height: 40px;
            margin-bottom: 5px;
        }
    }

    textarea {
        width: 100%;
        min-height: 60px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px;
        font-size: 0.8rem;
        resize: vertical;
        transition: border 0.2s;

        &:focus {
            border-color: #007bff;
            outline: none;
        }

        &::placeholder {
            color: #aaa;
        }
    }
`;



const Icons: React.FC<Props> = ({ control, fieldName, defaultIcons = [], defaultIconDescriptions = {} }) => {
    const [icons, setIcons] = useState<IIcon[]>([]);
    const [selectedIcons, setSelectedIcons] = useState<string[]>(defaultIcons);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchIcons();
    }, []);

    const filteredIcons = icons.filter(icon => icon.name.toLowerCase().includes(searchQuery.toLowerCase())); // Filtering logic based on the search query


    async function fetchIcons() {
        const response = await getIcons();
        setIcons(response);
    }

    const handleIconSelection = (iconId: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedIcons(prev => [...prev, iconId]);
        } else {
            setSelectedIcons(prev => prev.filter(id => id !== iconId));
        }
    };

    return (
        <div>
            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="Search icons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </SearchContainer>
            <IconsContainer>
                {filteredIcons.map((icon) => { // Render the filtered icons
                    const isSelected = selectedIcons.includes(icon._id);
                    const defaultDescription = isSelected ? defaultIconDescriptions[icon._id] || "" : "";

                    return (
                        <IconWrapper key={icon._id}>
                            <input
                                type="checkbox"
                                id={icon._id}
                                value={icon._id}
                                checked={isSelected}
                                onChange={(e) => handleIconSelection(icon._id, e.target.checked)}
                            />
                            <label htmlFor={icon._id}>
                                <img src={`http://localhost:80/${icon.imagePath}`} alt={icon.name} />
                                {icon.name}
                            </label>
                            {isSelected && (
                                <>
                                    <Controller
                                        control={control}
                                        name={`${fieldName}[${selectedIcons.indexOf(icon._id)}].icon`}
                                        defaultValue={icon._id}
                                        render={({ field }) => (
                                            <input type="hidden" {...field} />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name={`${fieldName}[${selectedIcons.indexOf(icon._id)}].iconDescription`}
                                        defaultValue={defaultDescription}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                id={`iconDescription-${icon._id}`}
                                                placeholder="Enter icon description"
                                            />
                                        )}
                                    />
                                </>
                            )}
                        </IconWrapper>
                    );
                })}
            </IconsContainer>
        </div>
    );
};

export default Icons;
