# CLI ChatGPT with Node.js

## Installation

1. Clone the repository by running the following command:
`gh repo clone jorgenlt/nodejs-chatgpt`

2. Change into the cloned directory: 
`cd nodejs-chatgpt`

3. Install the required dependencies using npm: 
`npm install`



## Configuration

1. Create a new file named `.env`: 
`touch .env`

2. Open the `.env` file and add the following line, replacing `your-api-key` with your actual API key: 
`API_KEY=your-api-key`



## Usage

1. Start the application by running the following command: 
`node index`

## Creating an Alias to Open the Program with gpt:
To create an alias that allows you to open the program using the command gpt, follow these steps:

1. Open your terminal and navigate to the home directory by running the following command:
`cd`

2. Edit the configuration file named .zshrc using the nano editor. Enter the following command:
`nano .zshrc` or use your desired text editor.

3. Within the .zshrc file, locate the section where aliases are defined. Add the following line:
`alias gpt="$HOME/nodejs-chatgpt/run-chatgpt.sh"` or your installation path.

4. Save the changes to the .zshrc file and exit the editor.

5. Restart your terminal for the changes to take effect.
