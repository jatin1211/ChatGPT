import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid profession name",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      // using a function for detailed prompts
      prompt: generatePrompt(animal),
      temperature: 1,
      max_tokens: 200,
      // can change max_tokens value according to the requirement of the result's length
      n: 10,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    //  error handling logic 
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const professional =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();

    // 2 sample prompts to teach the model

  return `Tell me in detail how to become a professional.

How to become a Lawyer
###
Steps: 1. Obtain an Undergraduate Degree
2. Take the LSAT
3. Choose a law school
4. Complete the application form
5. Go to law school
6. Complete provincial bar admissions course and pass the exam.
###

How to become a Chartered professional accountant
###
Steps: 1.Earn an undergraduate degree.
2. Apply for the CPA professional education program.
3. Finish six modules in the CPA PEP.
4. Complete 30 months of accounting experience.
5. Pass the common final examination (CFE).
6. Get and maintain your certification.
###

How to become a ${professional}
Steps:`;
}
