import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form"
import { getArticles } from "../services/Article";
import styled from 'styled-components';

// Styled components
const CardGroup = styled.div`
    margin: 20px 0;
`;

const CardWrapper = styled.div`
    margin-bottom: 15px;
    border: 1px solid #e0e0e0;
    padding: 15px;
    border-radius: 5px;
`;

const StyledSelect = styled.select`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
`;

const StyledLabel = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
`;

const StyledTextArea = styled.textarea`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    resize: vertical;
`;

// ... Your Cards component code


interface IArticles {
    _id: string;
    title: string;
    slug: string;
    cardImage: string;
    ctaLink: string;
}

interface Props {
    control: any;
    fieldName: string;
    defaultValue: string;
}

const Cards: React.FC<Props> = ({ control, fieldName, defaultValue }) => {
    const [articles, setArticles] = useState<IArticles[]>([]);

    useEffect(() => {
        fetchCards();
    }, []);

    async function fetchCards() {
        const response = await getArticles();
        setArticles(response);
    }

    return (
        <CardGroup>
            <CardWrapper>
                {Array.from({ length: 3 }).map((_, i) => (
                    <React.Fragment key={i}>
                        <Controller
                            control={control}
                            name={`cards[${i}][title]`}
                            defaultValue={defaultValue}
                            render={({ field }) => (
                                <div>
                                    <StyledSelect {...field}>
                                        {articles.map((card: IArticles) => (
                                            <option key={card._id} value={card._id}>
                                                {card.title}
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name={`cards[${i}][rating]`}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <StyledLabel htmlFor={`article${i}_rating`}> RATING </StyledLabel>
                                    <StyledInput {...field} type="number" step="0.1" min="0" max="5" id={`article${i}_rating`} />
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name={`cards[${i}][points]`}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <StyledLabel htmlFor={`article${i}_points`}> POINTS </StyledLabel>
                                    <StyledInput {...field} type="text" id={`article${i}_points`} />
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name={`cards[${i}][anuity]`}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <StyledLabel htmlFor={`article${i}_anuity`}> ANUITY </StyledLabel>
                                    <StyledInput {...field} type="text" id={`article${i}_anuity`} />
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name={`cards[${i}][minimumIncome]`}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <StyledLabel htmlFor={`article${i}_minimumIncome`}> MINIMUN INCOME </StyledLabel>
                                    <StyledInput {...field} type="text" id={`article${i}_minimumIncome`} />
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name={`cards[${i}][pros]`}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <StyledLabel htmlFor={`article${i}_pros`}> PROS </StyledLabel>
                                    <StyledTextArea {...field} id={`article${i}_pros`} />
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name={`cards[${i}][cons]`}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <StyledLabel htmlFor={`article${i}_cons`}> CONS </StyledLabel>
                                    <StyledTextArea {...field} id={`article${i}_cons`} />
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name={`cards[${i}][details]`}
                            defaultValue=""
                            render={({ field }) => (
                                <>
                                    <StyledLabel htmlFor={`article${i}_details`}> DETAILS </StyledLabel>
                                    <StyledTextArea {...field} id={`article${i}_details`} />
                                </>
                            )}
                        />
                    </React.Fragment>
                ))}
            </CardWrapper>
        </CardGroup>
    )
}

export default Cards;
