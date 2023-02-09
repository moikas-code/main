import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const MAX_TOKEN_LENGTH = 2048;
function truncatePrompt(prompt: string) {
  if (prompt.length <= MAX_TOKEN_LENGTH) {
    return prompt;
  } else {
    return prompt.substring(prompt.length - MAX_TOKEN_LENGTH, prompt.length);
  }
}

export default async function (
  req: {
    body: {
      prompt: string;
      context: any;
    };
  },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: {
          error?: {message: string} | {message: string} | {message: string};
          result?: any;
        }): void;
        new (): any;
      };
    };
  }
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const _text = req.body.prompt || '';
  if (_text.length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter message',
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(_text),
      temperature: 0.9,
      max_tokens: 3500,
    });

    console.log(completion.data);
    res.status(200).json({result: completion.data.choices[0].text});
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function generatePrompt(text: any) {
  // const _t = truncatePrompt(text);
  return [
    '!Only Responds If prompt Includes @AI!',
    'This is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. Only Responds If prompt Includes @AI',

    'Developer: Moikapy',
    'Twitter: @moikapy_',
    'Github: https://github.com/moikapy',
    'Twitch: https://www.twitch.tv/moikapy',
    `Today's Date: ${new Date().toLocaleDateString()}`,
    ...text,
    '...awaiting response from bot...',
  ].join('\n');
}
