console.log(">>> LOADED OPENAI.JS VERSION 2 <<<");
console.log("OPENAI_API_KEY =", process.env.OPENAI_API_KEY);

class OpenAIAPI {
    static async generateResponse(userMessage, conversationHistory = []) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error("OPENAI_API_KEY is not set!");
            return "Server configuration error: API key missing.";
        }

        const endpoint = 'https://api.openai.com/v1/chat/completions';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // safer, most keys have access
                    messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
                    max_tokens: 150
                }),
            });

            const responseData = await response.json();
            console.log("RAW OPENAI RESPONSE:", responseData); // log full response for debugging

            if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
                return responseData.choices[0].message.content;
            } else if (responseData.error) {
                console.error("OpenAI API returned an error:", responseData.error);
                return `OpenAI API Error: ${responseData.error.message}`;
            } else {
                console.error("No choices returned by OpenAI API");
                return "Sorry, I couldn't generate a response.";
            }

        } catch (err) {
            console.error("Error calling OpenAI API:", err);
            return "Error: Could not reach OpenAI API.";
        }
    }
}

module.exports = { OpenAIAPI };
