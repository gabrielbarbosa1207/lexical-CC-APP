import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { getAuthors } from '../services/author';

interface IAuthor {
  name: string;
  _id: string;
  photo:string;
}

interface Props {
  control:any; // This comes from react-hook-form's useForm()
  fieldName: string;
  defaultValue:string;
}

const Authors: React.FC<Props> = ({ control, fieldName, defaultValue }) => {
  const [authors, setAuthors] = useState<IAuthor[]>([]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  async function fetchAuthors() {
    const response = await getAuthors();
    setAuthors(response);
  }

  return (
    <Controller
      control={control}
      name={fieldName}
      defaultValue={defaultValue}
      render={({ field }) => (
        <select {...field}>
          {authors.map((author: IAuthor) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>
      )}
    />
  );
};

export default Authors;
