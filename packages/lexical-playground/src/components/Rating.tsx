import React from 'react';
import styled from "styled-components";

// RatingGroup Component
interface RatingGroupProps {
    groupName: string;
    groupNameDisplay: string;
    register: any;
    defaultValue?: number;
}

const StyledRatingGroup = styled.div`
    margin: 20px 0;

    label {
        display: inline-block;
        font-size: 1rem;
        margin-right: 10px;
    }

    .star-rating {
        display: inline-block;
        position: relative;
    }

    label.star-label {
        color: lightgray;
        font-size: 24px;
        cursor: pointer;
        transition: color 0.3s;

        &::before {
            content: "★";
        }
    }

    input[type="radio"]:checked + .star-label {
        color: gold;
    }
`;

const RatingGroup: React.FC<RatingGroupProps> = ({ groupName, groupNameDisplay, register, defaultValue }) => {
    return (
        <StyledRatingGroup>
            <div className="form-group">
                <label>{groupNameDisplay}:</label>
                <div className="star-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <React.Fragment key={i}>
                            <input 
                                {...register(groupName, { required: true })}
                                type="radio" 
                                id={`${groupName}Rating${i+1}`} 
                                value={i+1}
                                defaultChecked={defaultValue === i+1}
                            />
                            <label className="star-label" htmlFor={`${groupName}Rating${i+1}`}></label>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </StyledRatingGroup>
    );
}

// RateFactorsComponent
interface RateFactorsProps {
    register: any;
    defaultValues?: {
      mainFeatures?: number;
      taxes?: number;
      otherFeatures?: number;
      cardBenefits?: number;
      issuerBenefits?: number;
    }
}

const StyledRateFactorsComponent = styled.fieldset`
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 20px 0;
    background-color: #f7f7f7;

    legend.rateFactors {
        color: #333;
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 15px;
        cursor: pointer;
    }

    label {
        color: #555;
        font-size: 1.1rem;
        font-weight: 600;
        margin-right: 10px;
        padding: 5px 0;

        &:hover {
            color: #333;
        }
    }
`;

const RateFactorsComponent: React.FC<RateFactorsProps> = ({ register, defaultValues = {} }) => {
    return (
        <StyledRateFactorsComponent>
            <legend className="rateFactors">Rate Factors &#9660;</legend>
            <RatingGroup groupName="mainFeatures" groupNameDisplay="Main Features" register={register} defaultValue={defaultValues.mainFeatures} />
            <RatingGroup groupName="taxes" groupNameDisplay="Taxes" register={register} defaultValue={defaultValues.taxes} />
            <RatingGroup groupName="otherFeatures" groupNameDisplay="Other Features" register={register} defaultValue={defaultValues.otherFeatures} />
            <RatingGroup groupName="cardBenefits" groupNameDisplay="Card Benefits" register={register} defaultValue={defaultValues.cardBenefits} />
            <RatingGroup groupName="issuerBenefits" groupNameDisplay="Issuer/Bank Benefits" register={register} defaultValue={defaultValues.issuerBenefits} />
        </StyledRateFactorsComponent>
    );
};

export default RateFactorsComponent;
