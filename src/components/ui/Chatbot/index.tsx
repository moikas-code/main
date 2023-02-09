import React, {useEffect, useState} from 'react';
import axios from 'axios';

function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [pageText, setPageText] = useState('');
  const [prompts, setPrompts] = useState<any>([]);
  useEffect(() => {
    setPageText(document.body.innerText);
  }, []);
  const handleInput = (event: {
    target: {value: React.SetStateAction<string>};
  }) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    prompts.push(input);
    try {
      let res: any = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt: input}),
      });
      res = await res.json();
      console.log(res);
      setResponse(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Input:</label>
          <input
            className='form-control'
            type='text'
            value={input}
            onChange={handleInput}
          />
        </div>
        <button className='btn btn-primary' type='submit'>
          Submit
        </button>
      </form>
      <div className='form-group'>
        <label>Response:</label>
        <textarea
          className='form-control'
          rows={5}
          value={response}
          readOnly></textarea>
      </div>
    </div>
  );
}

export default Chatbot;
