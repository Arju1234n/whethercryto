import express from 'express';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Configure the AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Crypto currency tool
async function cryptoCurrency({coin}) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`);
    const data = await response.json();
    return data;
}

// Weather tool
async function weatherInformation({city}) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=d6a3bcd7a43c4ed59c2155208252404&q=${city}&aqi=no`);
    const data = await response.json();
    return data;
}

// Tool definitions
const cryptoInfo = {
    name:"cryptoCurrency",
    description: "We can give you the current price or other information related to cryptocurrency like bitcoin and ethereum etc",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            coin:{
                type:SchemaType.STRING,
                description: "It will be the name of the cryptocurrency like bitcoin, ethereum, etc"
            }
        },
        required:['coin']
    }
};

const weatherInfo = {
    name: "weatherInformation",
    description: "You can get the current weather information of any city like london, goa etc",
    parameters:{
        type:SchemaType.OBJECT,
        properties:{
            city:{
                type:SchemaType.STRING,
                description:"Name of the city for which I have to fetch weather information like london, goa etc"
            }
        },
        required:['city']
    }
};

const tools = [{
    functionDeclarations: [cryptoInfo, weatherInfo]
}];

const toolFunctions = {
    "cryptoCurrency": cryptoCurrency,
    "weatherInformation": weatherInformation
};

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Convert frontend history to Gemini format
        const chatHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Add current message
        chatHistory.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp",
            tools
        });

        let responseData = null;
        let responseType = 'text';
        let finalResponse = '';

        // Run the agent loop
        while(true) {
            const result = await model.generateContent({
                contents: chatHistory,
            });
           
            const response = result.response;
            const functionCalls = response.functionCalls();
            
            if (functionCalls && functionCalls.length > 0) {
                console.log("Function called");
                const functionCall = functionCalls[0];
                const {name, args} = functionCall;

                // Execute the function
                const functionResponse = await toolFunctions[name](args);
                responseData = functionResponse;
                responseType = name === 'cryptoCurrency' ? 'crypto' : 'weather';

                // Add function call to history
                chatHistory.push({
                    role: "model",
                    parts: [{functionCall: functionCall}],
                });

                chatHistory.push({
                    role:'user',
                    parts:[{
                        functionResponse: {
                            name: functionCall.name,
                            response: {
                                result: functionResponse,
                            },
                        }
                    }]
                });
            } else {
                finalResponse = response.text();
                break;
            }
        }

        res.json({
            response: finalResponse,
            type: responseType,
            data: responseData
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'An error occurred while processing your request',
            details: error.message 
        });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`\n📱 Open your browser and visit: http://localhost:${PORT}\n`);
});
