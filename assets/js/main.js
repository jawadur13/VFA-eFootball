function loadComponents() {
    const isSubfolder = window.location.pathname.includes('/teams/') ||
        window.location.pathname.includes('/vpl/') ||
        window.location.pathname.includes('/vcl/') ||
        window.location.pathname.includes('/fantasy/');

    const prefix = isSubfolder ? '../' : '';

    fetch(prefix + 'components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-header').innerHTML = data;
        });

    fetch(prefix + 'components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-footer').innerHTML = data;
        });

    // Set favicon
    let faviconUrl = prefix + 'assets/images/logos/VFA_logo.png';
    const teamLogoImg = document.querySelector('.team-logo-lg');
    if (teamLogoImg) {
        faviconUrl = teamLogoImg.src;
    }

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = faviconUrl;
    // Load Global Chatbot
    fetch(prefix + 'components/chatbot.html')
        .then(response => response.text())
        .then(data => {
            const chatWrapper = document.createElement('div');
            chatWrapper.innerHTML = data;
            document.body.appendChild(chatWrapper);
            initChatbot();
        });
}

function initChatbot() {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    if (!chatToggleBtn || !chatWindow) return;

    chatToggleBtn.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
        if (chatWindow.style.display === 'flex') chatInput.focus();
    });
    closeChatBtn.addEventListener('click', () => chatWindow.style.display = 'none');

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg', sender);
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\n/g, '<br>');
        msgDiv.innerHTML = formattedText;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        chatInput.value = '';
        typingIndicator.style.display = 'block';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            typingIndicator.style.display = 'none';
            appendMessage(data.reply, 'bot');
        } catch (error) {
            typingIndicator.style.display = 'none';
            console.error(error);
            appendMessage("Sorry, I'm having trouble connecting to the administration servers right now. Please make sure the site is deployed on Vercel.", 'bot');
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Draggable Chat Window
    const chatHeader = document.getElementById('chat-header');
    let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    if (chatHeader) {
        chatHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        chatHeader.addEventListener('touchstart', dragStart, { passive: true });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);
    }

    function dragStart(e) {
        if (e.target.id === 'close-chat') return;
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        isDragging = true;
    }

    function drag(e) {
        if (isDragging) {
            if (e.type === 'touchmove') e.preventDefault();
            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            chatWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }
    function dragEnd() { isDragging = false; }
}

loadComponents();