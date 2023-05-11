import readline from "readline";
import { config } from 'dotenv';
import fetch from 'node-fetch';

// loading and getting the api key from .env
config();
const key = process.env.API_KEY;

// banner to display in a typewriter style when starting the program
const typeWriterBanner = () => {
    const message = `
        _______________________________________________________________
        
        
        \tW E L C O M E   T O   C H A T G P T

        _______________________________________________________________
    `;

    let i = 0;
    const intervalId = setInterval(() => {
        process.stdout.write(`\x1b[32m${message.charAt(i)}\x1b[0m`); 
        i++;
        if (i > message.length) {
            clearInterval(intervalId);
            console.log('\n');
        }
    }, 7);
};

// welcome text to display after the banner
const typeWriterWelcomeText = () => {
        const message = 'What can I do for you today?';
        let i = 0;
        const intervalId = setInterval(() => {
            if (i === 0) {
                process.stdout.write(`🤖 ChatGPT: `);
            }
            process.stdout.write(`\x1b[32m${message.charAt(i)}\x1b[0m`); 
            i++;
            if (i > message.length) {
                clearInterval(intervalId);
                console.log('\n');
                userInterface.prompt();
            }
        }, 15);
    
};

// loading animation to use while waiting for the api response
const loadingAnimation = () => {
    let dots = '';
    const intervalId = setInterval(() => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`\x1b[32m${dots}\x1b[0m`);
        dots += '.';
        if (dots.length > 20) {
            dots = '';
        }
    }, 50);

    return intervalId;
};

// new userInterface instance
const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// executing the banner
typeWriterBanner();

// executing the welcome text after the banner is displayed
setTimeout(() => {
    typeWriterWelcomeText();
}, 1600);

// to store the chat history
let chatHistory = [];

// listening to the users input
userInterface.on('line', async (userPrompt) => {
    // getting the chat history and the new user prompt
    const requestMessages = [
        ...chatHistory,
        {
            role: "user", 
            content: userPrompt
        }
    ];
    
    // putting together the options for the api call
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: requestMessages,
            max_tokens: 1000
        })
    };

    console.log('');

    // start the loading animation while waiting for api response
    const loadingInterval = loadingAnimation();
    
    // api call
    await fetch('https://api.openai.com/v1/chat/completions', options)
    .then(response => response.json())
    .then(data => {
        process.stdout.cursorTo(0); 
        process.stdout.clearLine();

        // stopping the loading animation
        clearInterval(loadingInterval);

        const responseMessage = data.choices[0].message;
        
        const message = responseMessage.content;        
        let i = 0;
        process.stdout.write('\x1b[37m🤖 ChatGPT: \x1b[32m');
        const intervalId = setInterval(() => {
            if (i === message.length) {
                clearInterval(intervalId);
                setTimeout(() => {
                    // changing text color back to white
                    console.log('\x1b[37m');

                    console.log('');
                }, 50);
            } else {
                // typing response char by char
                process.stdout.write(message.charAt(i));
                i++;
            }
        }, 20);
        
        const newMessages = [
            ...requestMessages,
            {
                role: responseMessage.role,
                content: responseMessage.content,
            }
        ];
        
        // updating the chat history
        chatHistory = newMessages;
    })
    .catch(error => console.error(error));
});
