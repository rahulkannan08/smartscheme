// Toggleable Gemini Chatbot UI for SMART THITTAM

(function() {
    // --- Styles ---
    const style = document.createElement('style');
    style.textContent = `
    .st-chatbot-toggle-btn {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 9999;
        background: #1976d2;
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        cursor: pointer;
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .st-chatbot-window {
        position: fixed;
        bottom: 100px;
        right: 32px;
        width: 350px;
        max-width: 98vw;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        z-index: 10000;
        display: none;
        flex-direction: column;
        overflow: hidden;
        height: 420px;
    }
    .st-chatbot-header {
        background: #222;
        color: #fff;
        padding: 14px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
    }
    .st-chatbot-header h3 {
        font-size: 1.1rem;
        margin: 0;
        font-weight: 600;
    }
    .st-chatbot-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
    }
    .st-chatbot-messages {
        flex-grow: 1;
        padding: 14px;
        overflow-y: auto;
        background: #f7f7f7;
    }
    .st-message-row {
        display: flex;
        margin-bottom: 10px;
    }
    .st-message-row.user {
        justify-content: flex-end;
    }
    .st-message-row.bot {
        justify-content: flex-start;
    }
    .st-message-bubble {
        padding: 10px 14px;
        border-radius: 12px;
        max-width: 80%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        font-size: 1rem;
    }
    .st-message-bubble.user {
        background: #444;
        color: #fff;
    }
    .st-message-bubble.bot {
        background: #1976d2;
        color: #fff;
    }
    .st-chatbot-input-area {
        display: flex;
        align-items: center;
        padding: 12px;
        background: #fff;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        border-top: 1px solid #eee;
    }
    .st-chatbot-input {
        flex: 1;
        padding: 8px 12px;
        border-radius: 24px;
        border: 1px solid #ccc;
        font-size: 1rem;
        outline: none;
        margin-right: 8px;
    }
    .st-send-btn {
        background: #1976d2;
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
    }
    .st-send-btn:hover {
        background: #1356a2;
    }
    .st-typing-indicator {
        font-style: italic;
        color: #888;
        margin-left: 8px;
    }
    @media (max-width: 600px) {
        .st-chatbot-window {
            right: 2vw;
            width: 98vw;
            height: 95vh;
            bottom: 2vw;
        }
    }
    `;
    document.head.appendChild(style);

    // --- Elements ---
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'st-chatbot-toggle-btn';
    toggleBtn.title = 'Ask AI Assistant';
    toggleBtn.innerHTML = '<span class="material-icons">chat</span>';

    const chatbotWindow = document.createElement('div');
    chatbotWindow.className = 'st-chatbot-window';
    chatbotWindow.innerHTML = `
        <div class="st-chatbot-header">
            <h3>SMART SCHEME AI Assistant</h3>
            <button class="st-chatbot-close" title="Close">&times;</button>
        </div>
        <div class="st-chatbot-messages" id="st-chatbot-messages">
            <div class="st-message-row bot">
                <div class="st-message-bubble bot">
                    <p>Hello! I'm your SMART SCHEME AI Assistant. I can help you with information about Tamil Nadu government schemes, eligibility criteria, application processes, and more. How can I assist you today?</p>
                </div>
            </div>
        </div>
        <div class="st-chatbot-input-area">
            <input type="text" class="st-chatbot-input" id="st-chatbot-input" placeholder="Type your message...">
            <button class="st-send-btn" id="st-send-btn" title="Send">
                <span class="material-icons">send</span>
            </button>
        </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(chatbotWindow);

    // --- Toggle Logic ---
    function openChatbotWindow() {
        chatbotWindow.style.display = 'flex';
    }
    toggleBtn.addEventListener('click', () => {
        chatbotWindow.style.display = chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '' ? 'flex' : 'none';
    });
    chatbotWindow.querySelector('.st-chatbot-close').addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
    });

    // Expose openChatbotWindow globally
    window.openChatbotWindow = openChatbotWindow;

    // --- Chat Logic ---
    const chatMessages = chatbotWindow.querySelector('#st-chatbot-messages');
    const userInput = chatbotWindow.querySelector('#st-chatbot-input');
    const sendButton = chatbotWindow.querySelector('#st-send-btn');

    function addMessage(text, isUser = false) {
        const messageRow = document.createElement('div');
        messageRow.className = `st-message-row ${isUser ? 'user' : 'bot'}`;

        const messageBubble = document.createElement('div');
        messageBubble.className = `st-message-bubble ${isUser ? 'user' : 'bot'}`;
        messageBubble.innerHTML = text;

        messageRow.appendChild(messageBubble);
        chatMessages.appendChild(messageRow);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        addMessage('<span class="st-typing-indicator">...</span>');
    }

    function removeTypingIndicator() {
        const indicators = chatMessages.querySelectorAll('.st-typing-indicator');
        indicators.forEach(indicator => {
            indicator.parentElement.parentElement.remove();
        });
    }

    async function fetchGeminiResponse(prompt) {
        // Fetch Gemini API key from backend (use full URL)
        let apiKey = '';
        try {
        const res = await fetch('https://smartscheme-backend.onrender.com/api/get-gemini-key');
            const data = await res.json();
            apiKey = data.key;
        } catch (err) {
            addMessage('<p style="color:red;">Error: Unable to fetch Gemini API key.</p>', false);
            return { text: '' };
        }
        if (!apiKey) {
            addMessage('<p style="color:red;">Error: Gemini API key not configured.</p>', false);
            return { text: '' };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        const systemPrompt = "You are a helpful and friendly chatbot. You provide concise and useful answers.";

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...payload,
                systemInstruction: {
                    parts: [{
                        text: systemPrompt
                    }]
                }
            })
        };

        let responseText = '';
        let retries = 0;
        const maxRetries = 3;
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        while (retries < maxRetries) {
            try {
                const response = await fetch(apiUrl, requestOptions);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error.message}`);
                }
                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    responseText = candidate.content.parts[0].text;
                    break;
                } else {
                    throw new Error("Invalid API response format.");
                }
            } catch (error) {
                retries++;
                if (retries < maxRetries) {
                    await delay(1000 * Math.pow(2, retries - 1));
                } else {
                    addMessage('<span style="color:red;">Failed to get a response from the chatbot. Please try again later.</span>', false);
                }
            }
        }
        return { text: responseText };
    }

    async function handleSendMessage() {
        const prompt = userInput.value.trim();
        if (prompt === '') return;

        addMessage(prompt, true);

        userInput.value = '';
        sendButton.disabled = true;

        showTypingIndicator();

        const { text } = await fetchGeminiResponse(prompt);

        removeTypingIndicator();

        addMessage(text, false);

        sendButton.disabled = false;
    }

    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
})();
