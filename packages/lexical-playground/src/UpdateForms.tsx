/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {$createLinkNode} from '@lexical/link';
import {$createListItemNode, $createListNode} from '@lexical/list';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {$createHeadingNode, $createQuoteNode} from '@lexical/rich-text';
import {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
import * as React from 'react';
import * as yup from "yup";
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import {isDevPlayground} from './appSettings';
import {SettingsContext, useSettings} from './context/SettingsContext';
import {SharedAutocompleteContext} from './context/SharedAutocompleteContext';
import {SharedHistoryContext} from './context/SharedHistoryContext';
import Editor from './Editor';
import logo from './images/logo.svg';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import DocsPlugin from './plugins/DocsPlugin';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import {TableContext} from './plugins/TablePlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import Settings from './Settings';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import Authors from './components/Author';
import FileInput from './components/FileInput';
import styled from "styled-components";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import Icons from './components/Icon';
import RateFactorsComponent from './components/Rating';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticle } from './services/articleBySlug';
import { ObjectId } from 'mongoose';


const palette = {
  primary: '#007BFF',
  primaryDark: '#0056b3',
  secondary: '#6c757d',
  secondaryDark: '#495057',
  accent: '#f8c200',
  grayLight: '#e1e1e1',
  gray: '#adb5bd',
  grayDark: '#6c757d',
  white: '#ffffff',
  black: '#000000'
};

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${palette.grayLight};
  margin-bottom: 1rem;

  a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: ${palette.black};
      
      img {
          width: 100px;
          height: 100px;
          display:block;
          margin:auto
      }
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin:auto;
  width:72%;
  gap: 1rem;
  border: 1px solid lightgray;
  border-radius:15px;
  padding:35px;
  box-shadow:0px 0px 3px;
  
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${palette.grayLight};
  transition: border 0.2s;

  &:focus {
      border-color: ${palette.primary};
      outline: none;
  }
`;

const StyledLabel = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${palette.black};
  text-alig:center;
`;

const EditorContainer = styled.div`
  background-color: ${palette.white};
  padding: 1rem;
  border: 1px solid ${palette.grayLight};
  border-radius: 4px;
  min-height: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background-color: ${palette.primary};
      color: ${palette.white};
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
          background-color: ${palette.primaryDark};
      }

      &:active {
          background-color: ${palette.secondaryDark};
      }

      &:disabled {
          background-color: ${palette.gray};
          cursor: not-allowed;
      }
  }
`;

const Input = styled(StyledInput)<{ error?: boolean, fullwidth?: boolean }>`
    width: ${props => props.fullwidth ? '100%' : 'auto'};
    border: ${props => props.error ? `1px solid red` : `1px solid ${palette.grayLight}`};

    &:focus {
        border-color: ${props => props.error ? `red` : `${palette.primary}`};
        outline: none;
    }
`;

const ImagePreviewBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f7f7f7;  // A light grey color
    border: 1px solid #e1e1e1;  // A border to define the box
    border-radius: 5px;  // Soften the edges of the box
    margin: 20px 0;  // Spacing outside the box;
    color:gray;
    font-family: Sans-serif;
    font-weight:500;
`;

const StyledImage = styled.img`
    width: 200px;
    margin-top: 10px;  // Adds some spacing between the filename and the image
`;

const FileInputLabel = styled.label`
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display:block;
    margin:auto;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;

`;


const ContainerComp = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
`




console.warn(
  'If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.',
);

function prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Welcome to the playground'));
    root.append(heading);
    const quote = $createQuoteNode();
    quote.append(
      $createTextNode(
        `In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. ` +
          `You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.`,
      ),
    );
    root.append(quote);
    const paragraph = $createParagraphNode();
    paragraph.append(
      $createTextNode('The playground is a demo environment built with '),
      $createTextNode('@lexical/react').toggleFormat('code'),
      $createTextNode('.'),
      $createTextNode(' Try typing in '),
      $createTextNode('some text').toggleFormat('bold'),
      $createTextNode(' with '),
      $createTextNode('different').toggleFormat('italic'),
      $createTextNode(' formats.'),
    );
    root.append(paragraph);
    const paragraph2 = $createParagraphNode();
    paragraph2.append(
      $createTextNode(
        'Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!',
      ),
    );
    root.append(paragraph2);
    const paragraph3 = $createParagraphNode();
    paragraph3.append(
      $createTextNode(`If you'd like to find out more about Lexical, you can:`),
    );
    root.append(paragraph3);
    const list = $createListNode('bullet');
    list.append(
      $createListItemNode().append(
        $createTextNode(`Visit the `),
        $createLinkNode('https://lexical.dev/').append(
          $createTextNode('Lexical website'),
        ),
        $createTextNode(` for documentation and more information.`),
      ),
      $createListItemNode().append(
        $createTextNode(`Check out the code on our `),
        $createLinkNode('https://github.com/facebook/lexical').append(
          $createTextNode('GitHub repository'),
        ),
        $createTextNode(`.`),
      ),
      $createListItemNode().append(
        $createTextNode(`Playground code can be found `),
        $createLinkNode(
          'https://github.com/facebook/lexical/tree/main/packages/lexical-playground',
        ).append($createTextNode('here')),
        $createTextNode(`.`),
      ),
      $createListItemNode().append(
        $createTextNode(`Join our `),
        $createLinkNode('https://discord.com/invite/KmG4wQnnD9').append(
          $createTextNode('Discord Server'),
        ),
        $createTextNode(` and chat with the team.`),
      ),
    );
    root.append(list);
    const paragraph4 = $createParagraphNode();
    paragraph4.append(
      $createTextNode(
        `Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).`,
      ),
    );
    root.append(paragraph4);
  }
}

interface IAuthor{
  _id:string;
  name:string;
  defaultValue:string;
}

interface ITags {
  bankTag:string;
  issuerTag:string;
  benefitTag:string;
}



interface IArticle {
  _id: string;
  slug:string;
  title:string;
  cardImage:string;
  ctaLink:string;
  writers:IAuthor;
  reviewers:IAuthor;
  checkers:IAuthor;
  tags:ITags
  mainFeatures: number;
  taxes: number;
  otherFeatures: number;
  cardBenefits: number;
  issuerBenefits: number;
  defaultIconDescriptions: { [iconId: string]: string; };
  defaultIcons: string[];
  articleDescription:string;
  content:string;
}




function UpdateForms(): JSX.Element {

  const { slug } = useParams<{ slug:string }>();
  const [article, setArticle ] = useState<IArticle | null>(null);

  const methods = useForm()


  useEffect(()=>{
    fetchArticles()
  }, [slug]);


  async function fetchArticles(){
    if(slug){
      const response: IArticle = await getArticle(slug);
      setArticle(response)
    }
  }

  useEffect(() => {
    if (article?.content && editorRef.current) {
      const editorInstance = editorRef.current;
  
      editorInstance.update(() => {
        // Parse the content to a DOM instance
        const parser = new DOMParser();
        const dom = parser.parseFromString(article.content, "text/html");
        
        // Generate LexicalNodes from the DOM
        const nodes = $generateNodesFromDOM(editorInstance, dom);
  
        // Select the root
        const root = $getRoot();
  
        root.clear();
  
        // Create a map to store the heading levels
        const headingLevels = new Map();
  
        // Iterate over the nodes and convert them to LexicalNodes
        nodes.forEach((n) => {
          if (n.nodeName === "H1") {
            headingLevels.set(n, 1);
          } else if (n.nodeName === "H2") {
            headingLevels.set(n, 2);
          } else if (n.nodeName === "H3") {
            headingLevels.set(n, 3);
          } else {
            // The node is a paragraph
            const paragraphNode = $createParagraphNode();
            paragraphNode.append(n);
            root.append(paragraphNode);
          }
        });
  
        // Iterate over the heading levels and create heading nodes
        for (const [node, level] of headingLevels) {
          const headingNode = $createHeadingNode(level);
          headingNode.append(node);
          root.append(headingNode);
        }
      });
    }
  }, [article]);


    // Define your schema
    const schema = yup
    .object({
      slug: yup.string(),
      title: yup.string(),
      cardImage:yup.string(),
      articleDescription: yup.string(),
      content: yup.string(),
      ctaLink: yup.string(),
      tags: yup.object({
        bankTag: yup.string(),
        issuerTag: yup.string(),
        benefitTag: yup.string(),
        // Add any other tag fields here
    }),
      createdAt: yup.date().notRequired(),     
      mainFeatures:yup.number(),
      cardBenefits:yup.number(),
      taxes:yup.number(),
      otherFeatures:yup.number(),
      issuesBenefits:yup.number(),
      writers:yup.string(),
      reviewers:yup.string(),
      checkers:yup.string()

    })
    .required();

    const { register, handleSubmit, control, setValue } = useForm({
      resolver: yupResolver(schema),
      
    });

  const editorRef: any = React.useRef();
  // const descriptionEditorRef: any = React.useRef();
  // const faqEditorRef: any = React.useRef()

  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageURL, setExistingImageURL] = useState<string | null>(article?.cardImage || null);

  const handleFileChange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
          setSelectedFile(file);
          setSelectedFileName(file.name);
  
          // FileReader to read the content of the file
          const reader = new FileReader();
  
          reader.onloadend = () => {
              setImagePreview(reader.result as string);
          };
  
          reader.readAsDataURL(file);
      } else {
          setSelectedFileName(null);
          setImagePreview(null);  // reset the image preview
      }
  };
  
  const onSubmit = async (data: any) => {  
    // First, upload the card image if a new one is selected
    if (selectedFile) {
        const formData = new FormData();
        formData.append('cardImage', selectedFile);

        try {
            const response = await axios.post('http://localhost:80/upload/images', formData);
            data.cardImage = response.data.cardImage;
        } catch (error) {
            console.error("Error uploading the file", error);
            alert("Image upload failed!");
            return;  // If image upload fails, don't proceed with the article update
        }
    } else if (existingImageURL) { 
        data.cardImage = existingImageURL;
    } else {
        delete data.cardImage;
    }

    // Handle the editor content
    editorRef.current.update(() => {
        // Generate HTML from the editor state.
        const htmlString = $generateHtmlFromNodes(editorRef.current, null);
        console.log('HTML content:', htmlString);
        // Set the content of the data object.
        data.content = htmlString;
    });

    console.log("Data to update: ", data);



    // Update the article with the provided data
    try {
        // Assuming you have the article's ID or slug stored in a variable called articleId
        const response = await axios.put(`http://localhost:80/articles/update/${article?.slug}`, data);
        alert("Article successfully updated");
        console.log(response.data);
    } catch (error) {
        console.error(error);
        alert("Article update failed");
    }
};

  
  const {
    settings: {isCollab, emptyEditor, measureTypingPerf},
  } = useSettings();

  const initialConfig = {
    editorState: isCollab
      ? null
      : emptyEditor
      ? undefined
      : prepopulatedRichText,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  if(!article){
    return(
      <div>
        Loading ...
      </div>
    )
  }

  
  

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            {/* <StyledHeader>
              <a href="https://lexical.dev" target="_blank" rel="noreferrer">
                <img src={logo} alt="Lexical Logo" />
              </a>
            </StyledHeader> */}
            <br />
            <br />
            <FormProvider { ...methods }>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <ImagePreviewBox>
              <p style={
                {
                  textAlign:'center'
                }
              }>CARD IMAGE</p>
              <img src={`http://localhost:80/card-images/${article.cardImage}`}  alt='random text' style={{
                  width:'100px',
                  height:'auto',
                }}/>
              {selectedFileName && <p>File selected: {selectedFileName}</p>}
              {imagePreview && <StyledImage src={imagePreview} alt="Selected Preview" />}
            </ImagePreviewBox>
              <div>
              <Controller
                name="cardImage"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <div>
                        <FileInputLabel htmlFor="cardImage">Choose a new file</FileInputLabel>
                        <input
                            {...field}
                            type="file"
                            id="cardImage"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                handleFileChange(e);
                                field.onChange(e);  // Ensure React Hook Form's Controller gets the change event
                            }}
                        />
                    </div>
                )}
              />
              </div>
              <Input defaultValue={article.slug}
               {...register("slug")} placeholder="visa-infinity-bradesco" />
              <Input defaultValue={article.title}
               {...register("title")} placeholder="Bradesco Visa Infinity" />
              <Input defaultValue={article.ctaLink}
               {...register("ctaLink")} placeholder="https://www.bradesco.com.br" />

              <ContainerComp>                
                <StyledLabel>BANCO</StyledLabel>
                <Input defaultValue={article.tags.bankTag } {...register("tags.bankTag")} placeholder="BRADESCO" />
    
                <StyledLabel>EMISSOR</StyledLabel>
                <Input  defaultValue={article.tags.issuerTag } {...register("tags.issuerTag")} placeholder="VISA" />
    
                <StyledLabel>VARIANTE</StyledLabel>
                <Input  defaultValue={article.tags.benefitTag } {...register("tags.benefitTag")} placeholder="INFINITY" />
              </ContainerComp>   

              <ContainerComp>
                  <StyledLabel>AUTOR</StyledLabel>
                  <Authors control={control} fieldName="writers"  defaultValue={article.writers._id}/>

                  <StyledLabel>REVISOR</StyledLabel>
                  <Authors control={control} fieldName="reviewers" defaultValue={article.reviewers._id}/>             
                
                  <StyledLabel>CHECADOR</StyledLabel>
                  <Authors control={control} fieldName="checkers" defaultValue={article.checkers._id}/>
              </ContainerComp>

           
  
              <RateFactorsComponent 
              register={register} 
              defaultValues={{
                  mainFeatures: article?.mainFeatures,
                  taxes: article?.taxes,
                  otherFeatures: article?.otherFeatures,
                  cardBenefits: article?.cardBenefits,
                  issuerBenefits: article?.issuerBenefits
              }} 
            />
  
              <div>
                <StyledLabel>Icons:</StyledLabel>
                <Icons control={control} fieldName="icons" defaultIcons={article.defaultIcons} 
                defaultIconDescriptions={article.defaultIconDescriptions} />
              </div>
              
              <h2>
                 DESCRIÇÃO
              </h2>
              <textarea rows={10}  defaultValue={article.articleDescription}></textarea>
  
              <h2>EDITOR</h2>
              <EditorContainer>
                <Editor ref={editorRef} />
              </EditorContainer>
              {/*   
              <h2>Article Editor</h2>
              <EditorContainer>
                <Editor ref={editorRef} />
              </EditorContainer>
  
              <h2>FAQ Editor</h2>
              <EditorContainer>
                <Editor ref={faqEditorRef} />
              </EditorContainer> */}
  
              <ButtonDiv>
                <button type="submit">Save</button>
              </ButtonDiv>
            </StyledForm>
            </FormProvider>
            
            {/* <Settings /> */}
            {/* {isDevPlayground ? <DocsPlugin /> : null}
            {isDevPlayground ? <PasteLogPlugin /> : null}
            {isDevPlayground ? <TestRecorderPlugin /> : null} */}
  
            {measureTypingPerf ? <TypingPerfPlugin /> : null}
          </SharedAutocompleteContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
  
}

export default function PlaygroundApp(): JSX.Element {
  return (
    <SettingsContext>
      <UpdateForms />
      <a
        href="https://github.com/facebook/lexical/tree/main/packages/lexical-playground"
        className="github-corner"
        aria-label="View source on GitHub">
        <svg
          width="80"
          height="80"
          viewBox="0 0 250 250"
          style={{
            border: '0',
            color: '#eee',
            fill: '#222',
            left: '0',
            position: 'absolute',
            top: '0',
            transform: 'scale(-1,1)',
          }}
          aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            style={{
              transformOrigin: '130px 106px',
            }}
            className="octo-arm"
          />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className="octo-body"
          />
        </svg>
      </a>
    </SettingsContext>
  );
}
