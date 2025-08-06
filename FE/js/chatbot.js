// AI Chatbot functionality

// Chatbot state
let isChatbotOpen = false;
let isTyping = false;

// Toggle chatbot visibility
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    
    if (isChatbotOpen) {
        chatbot.classList.add('hidden');
        chatbotToggle.classList.remove('hidden');
    } else {
        chatbot.classList.remove('hidden');
        chatbotToggle.classList.add('hidden');
        // Focus on input when opening
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.focus();
            }
        }, 100);
    }
    
    isChatbotOpen = !isChatbotOpen;
}

// Send message to chatbot
async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message || isTyping) return;
    
    // Clear input
    chatInput.value = '';
    
    // Add user message
    addMessageToChat('user', message);
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Send message to API
        const response = await window.API.chatbot.sendMessage(message);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response
        if (response && response.reply) {
            addMessageToChat('ai', response.reply);
        } else {
            addMessageToChat('ai', 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment or contact our support team for assistance.');
        }
        
    } catch (error) {
        console.error('Chatbot error:', error);
        hideTypingIndicator();
        addMessageToChat('ai', 'I apologize, but I\'m having trouble connecting to the server right now. Please try again later.');
    }
}

// Add message to chat
function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    
    const messageBubble = document.createElement('div');
    messageBubble.className = `max-w-xs p-3 rounded-lg ${
        sender === 'user' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 text-gray-800'
    }`;
    
    messageBubble.innerHTML = `<p class="text-sm">${message}</p>`;
    messageDiv.appendChild(messageBubble);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex justify-start';
    typingDiv.id = 'typing-indicator';
    
    const typingBubble = document.createElement('div');
    typingBubble.className = 'bg-gray-100 text-gray-800 max-w-xs p-3 rounded-lg';
    typingBubble.innerHTML = `
        <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
        <p class="text-sm mt-1">AI is thinking...</p>
    `;
    
    typingDiv.appendChild(typingBubble);
    chatMessages.appendChild(typingDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

// Handle Enter key in chat input
function handleChatInputKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Initialize chatbot
function initializeChatbot() {
    // Add event listeners
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', handleChatInputKeyPress);
    }
    
    // Add click event for send button
    const sendButton = document.querySelector('#chatbot button[onclick="sendMessage()"]');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
}

// Quick response buttons (optional feature)
function addQuickResponses() {
    const quickResponses = [
        'Tell me about education schemes',
        'What are the eligibility criteria?',
        'How do I apply for schemes?',
        'Show me agriculture schemes'
    ];
    
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const quickResponseDiv = document.createElement('div');
    quickResponseDiv.className = 'mt-4 space-y-2';
    quickResponseDiv.innerHTML = `
        <p class="text-xs text-gray-500">Quick questions:</p>
        <div class="flex flex-wrap gap-2">
            ${quickResponses.map(response => `
                <button onclick="sendQuickResponse('${response}')" 
                        class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs hover:bg-blue-200 transition-colors">
                    ${response}
                </button>
            `).join('')}
        </div>
    `;
    
    chatMessages.appendChild(quickResponseDiv);
}

// Send quick response
function sendQuickResponse(message) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.value = message;
        sendMessage();
    }
}

// Auto-close chatbot when clicking outside (optional)
function setupChatbotClickOutside() {
    document.addEventListener('click', function(event) {
        const chatbot = document.getElementById('chatbot');
        const chatbotToggle = document.getElementById('chatbot-toggle');
        
        if (isChatbotOpen && 
            !chatbot.contains(event.target) && 
            !chatbotToggle.contains(event.target)) {
            toggleChatbot();
        }
    });
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
    setupChatbotClickOutside();
    
    // Add quick responses after initial message
    setTimeout(() => {
        addQuickResponses();
    }, 2000);
});

// Export functions for global access
window.chatbotFunctions = {
    toggleChatbot,
    sendMessage,
    addMessageToChat,
    showTypingIndicator,
    hideTypingIndicator,
    sendQuickResponse
}; 