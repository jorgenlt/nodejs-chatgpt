import readline from "readline";
import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const key = process.env.API_KEY;

let chatHistory = [];

const typeWriterWelcomeText = () => {
    const message = 'Hello, what can I do for you today?';
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
    }, 30);
};

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('\x1b[36m%s\x1b[0m', '________________________');
console.log('');
console.log('\x1b[36m%s\x1b[0m', '   WELCOME TO CHATGPT   ');
console.log('\x1b[36m%s\x1b[0m', '    Ask me anything!');
console.log('\x1b[36m%s\x1b[0m', '________________________');
console.log('');
typeWriterWelcomeText();

userInterface.on('line', async (userMessage) => {
    const requestMessages = [
        ...chatHistory,
        {
            role: "user", 
            content: userMessage
        }
    ];
    
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
    
    await fetch('https://api.openai.com/v1/chat/completions', options)
    .then(response => response.json())
    .then(data => {
        const responseMessage = data.choices[0].message;
        
        const message = responseMessage.content;        
        let i = 0;
        process.stdout.write('\x1b[37m🤖 ChatGPT: \x1b[32m');
        const intervalId = setInterval(() => {
            if (i === message.length) {
                clearInterval(intervalId);
                setTimeout(() => {
                    console.log('\x1b[37m'); // Change text color back to white
                    console.log('');
                    const newMessages = [
                        ...requestMessages,
                        {
                            role: responseMessage.role,
                            content: responseMessage.content,
                        }
                    ];
                    chatHistory = newMessages;
                }, 50);
            } else {
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
        
        chatHistory = newMessages;
    })
    .catch(error => console.error(error));
});
