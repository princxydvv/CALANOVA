window.addEventListener("DOMContentLoaded", function () {
    if (!window.chatbotInitialized) {
        window.AgentInitializer.init({
            agentRenderURL: "https://agent.jotform.com/0195e67ec2d7714fb116384aa33e4a3a8895",
            rootId: "JotformAgent-0195e67ec2d7714fb116384aa33e4a3a8895",
            formID: "0195e67ec2d7714fb116384aa33e4a3a8895",
            queryParams: ["skipWelcome=1", "maximizable=1"],
            domain: "https://www.jotform.com",
            isDraggable: false,
            background: "linear-gradient(180deg, #6C73A8 0%, #6C73A8 100%)",
            buttonBackgroundColor: "#0066C3",
            buttonIconColor: "#FFFFFF",
            variant: false,
            customizations: {
                "greeting": "Yes",
                "greetingMessage": "Hi! How can I assist you?",
                "openByDefault": "Yes",
                "pulse": "Yes",
                "position": "right",
                "autoOpenChatIn": "0"
            },
            isVoice: undefined
        });

        window.chatbotInitialized = true;
    }
});

