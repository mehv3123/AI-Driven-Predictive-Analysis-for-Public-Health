import React, { useState, useRef, useEffect } from 'react';
import { User, Send, Activity, AlertTriangle, Loader2, Bot, ChevronRight, Stethoscope, FileDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';

const symptomsList = [
    "Skin Rash", "Itching", "High Fever", "Mild Fever", "Chills",
    "Joint Pain", "Fatigue", "Weight Loss", "Excessive Thirst",
    "Neck Pain", "Breathlessness", "Continuous Cough", "Leg Swelling",
    "Severe Headache", "Nausea", "Vomiting", "Chest Pain",
    "Burning Urination", "Stomach Pain", "Yellowish Skin", "Acid Reflux",
    "Muscle Ache", "Loss of Appetite", "Dizziness", "Sneezing"
];

const SymptomAnalyzer = () => {
    const { user } = useAuth();
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [predictedDisease, setPredictedDisease] = useState("");
    const [showChat, setShowChat] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCheckboxChange = (symptom) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom)
                ? prev.filter((s) => s !== symptom)
                : [...prev, symptom]
        );
    };

    const generatePDF = async (content, type) => {
        const date = new Date().toLocaleString();
        const element = document.createElement('div');

        element.style.fontFamily = "'Space Grotesk', sans-serif";
        element.style.padding = '40px';
        element.style.color = '#1f2937';
        element.style.backgroundColor = '#ffffff';

        let htmlString = `
            <style>
                .pdf-content h1, .pdf-content h2, .pdf-content h3 { color: #047857; margin-top: 20px; margin-bottom: 10px; font-weight: 700; font-size: 18px; }
                .pdf-content ul { padding-left: 24px; margin-bottom: 16px; list-style-type: disc !important; }
                .pdf-content ol { padding-left: 24px; margin-bottom: 16px; list-style-type: decimal !important; }
                .pdf-content li { margin-bottom: 6px; display: list-item !important; line-height: 1.5; }
                .pdf-content p { margin-bottom: 12px; line-height: 1.6; }
                .pdf-content strong { font-weight: bold; color: #111827; }
            </style>
            <div style="border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #059669; margin: 0; font-size: 28px; font-weight: 700;">HealthGuard Pro Assessment</h1>
                <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                    <div>
                        <p style="color: #4b5563; font-size: 14px; margin: 4px 0;"><strong>Patient:</strong> ${user?.fullname || 'Rohan'}</p>
                        <p style="color: #4b5563; font-size: 14px; margin: 4px 0;"><strong>Symptoms:</strong> ${selectedSymptoms.join(', ')}</p>
                        <p style="color: #4b5563; font-size: 14px; margin: 4px 0;"><strong>Predicted Match:</strong> <span style="text-transform: capitalize;">${predictedDisease.replace(/_/g, ' ')}</span></p>
                    </div>
                    <div style="text-align: right;">
                        <p style="color: #6b7280; font-size: 14px; margin: 4px 0;"><strong>Date:</strong> ${date}</p>
                        <p style="color: #6b7280; font-size: 14px; margin: 4px 0;"><strong>Type:</strong> ${type === 'single' ? 'Initial Analysis' : 'Full Consultation'}</p>
                    </div>
                </div>
            </div>
            <div class="pdf-content" style="font-size: 15px;">
        `;

        if (type === 'single') {
            const parsedContent = await marked.parse(content);
            htmlString += `
                <div style="background-color: #ecfdf5; padding: 24px; border-radius: 12px;">
                    ${parsedContent}
                </div>
            `;
        } else {
            for (const msg of messages) {
                const isUser = msg.role === 'user';
                const parsedMsg = await marked.parse(msg.content);
                htmlString += `
                    <div style="margin-bottom: 20px; padding: 20px; border-radius: 12px; ${isUser ? 'background-color: #f3f4f6; text-align: right;' : 'background-color: #ecfdf5;'}">
                        <strong style="color: ${isUser ? '#374151' : '#059669'}; display: block; margin-bottom: 8px; font-size: 16px;">${isUser ? 'You' : 'Analyze Symptoms'}</strong>
                        <div style="color: #1f2937; text-align: left; display: inline-block; width: 100%;">
                            ${parsedMsg}
                        </div>
                    </div>
                `;
            }
        }

        htmlString += `
            </div>
            <div style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                <p>Disclaimer: This document is generated by an AI assistant and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
            </div>
        `;

        element.innerHTML = htmlString;

        html2pdf().set({
            margin: 10,
            filename: type === 'single' ? 'AI_Initial_Assessment.pdf' : 'AI_Full_Consultation.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(element).save();
    };

    const handleAnalyze = async () => {
        if (selectedSymptoms.length === 0) return;
        setIsAnalyzing(true);
        setPredictedDisease("");
        setShowChat(false);

        try {
            const response = await fetch("http://127.0.0.1:5001/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ symptoms: selectedSymptoms.join(", ") })
            });
            const data = await response.json();
            setPredictedDisease(data.disease);
        } catch (error) {
            setPredictedDisease("Error connecting to analysis server");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const callAI = async (systemPrompt, chatMessages) => {
        try {
            const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "z-ai/glm-4.5-air:free",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...chatMessages
                    ]
                })
            });

            if (openRouterRes.status === 429) {
                return await callGemini(systemPrompt, chatMessages);
            }

            if (!openRouterRes.ok) throw new Error("OpenRouter API failed");

            const data = await openRouterRes.json();
            return data.choices[0].message.content;

        } catch (error) {
            return await callGemini(systemPrompt, chatMessages);
        }
    };

    const callGemini = async (systemPrompt, chatMessages) => {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

        const contents = chatMessages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
        }));

        const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: contents
            })
        });

        if (!response.ok) throw new Error("Gemini API failed");

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    };

    const handleKnowMore = async () => {
        setShowChat(true);
        setIsLoading(true);

        const initialMessage = `The user has selected the following symptoms: ${selectedSymptoms.join(', ')}. The AI model has predicted a potential diagnosis of: ${predictedDisease}.`;

        const systemPrompt = `You are a medical AI assistant. You MUST format your response strictly using this EXACT Markdown template. Do not use numbers for headings, use exactly these ### headings and - for bullet points:
        
### Home Remedies
- [Provide first remedy here]
- [Provide second remedy here]

### Preventive Measures
- [Provide first measure here]
- [Provide second measure here]

### Disclaimer
**This information is for educational purposes only. You must consult a doctor and seek professional medical help.**`;

        try {
            const reply = await callAI(systemPrompt, [{ role: "user", content: initialMessage }]);
            setMessages([{
                role: 'assistant',
                content: reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            setMessages([{
                role: 'assistant',
                content: 'An error occurred while connecting to the AI. Please try again later.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");

        const newMessages = [...messages, {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
        setMessages(newMessages);
        setIsLoading(true);

        const systemPrompt = `You are a helpful medical AI assistant. The user is asking follow-up questions regarding their symptoms (${selectedSymptoms.join(', ')}) and the predicted diagnosis (${predictedDisease}). Maintain a helpful tone. Always use Markdown lists (with dashes '-') for multiple points, use bold text (**text**) for emphasis, and separate paragraphs with blank lines. Always remind them to consult a doctor.`;

        try {
            const reply = await callAI(systemPrompt, newMessages.map(m => ({ role: m.role, content: m.content })));
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'An error occurred while connecting to the AI. Please try again later.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">

                <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                    <div className="bg-emerald-600 px-6 py-6 flex items-center space-x-4 shrink-0">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-10 w-10 text-emerald-600" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                {user?.fullname || 'Rohan'}
                            </h1>
                            <p className="text-emerald-100 text-sm">
                                Symptom Assessment
                            </p>
                        </div>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="flex items-center mb-4 shrink-0">
                            <Activity className="h-5 w-5 text-emerald-600 mr-2" />
                            <h2 className="text-lg font-bold text-gray-900">Current Symptoms</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Select all that apply to guide the AI analysis.</p>

                        <div className="grid grid-cols-1 gap-3">
                            {symptomsList.map((symptom) => (
                                <label
                                    key={symptom}
                                    className={`flex items-start p-3 rounded-xl border cursor-pointer transition-colors ${selectedSymptoms.includes(symptom)
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                                            checked={selectedSymptoms.includes(symptom)}
                                            onChange={() => handleCheckboxChange(symptom)}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm flex-1">
                                        <span className={`font-medium ${selectedSymptoms.includes(symptom) ? 'text-emerald-900' : 'text-gray-700'
                                            }`}>
                                            {symptom}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                        <button
                            onClick={handleAnalyze}
                            disabled={selectedSymptoms.length === 0 || isAnalyzing}
                            className="w-full cursor-pointer flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Analyze Symptoms"
                            )}
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                        <div className="flex items-center">
                            <Bot className="h-6 w-6 text-emerald-600 mr-3" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Analyze Symptoms</h2>
                                <p className="text-xs text-gray-500">Powered by HealthGuard Pro</p>
                            </div>
                        </div>
                        {showChat && messages.length > 0 && (
                            <button
                                onClick={() => generatePDF(null, 'full')}
                                className="cursor-pointer flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm font-medium"
                                title="Download complete chat as PDF"
                            >
                                <FileDown className="h-4 w-4 mr-2" />
                                Get Report
                            </button>
                        )}
                    </div>

                    {!predictedDisease && !isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                            <AlertTriangle className="h-12 w-12 text-emerald-200 mb-4" />
                            <p className="text-gray-500 text-lg">Select your symptoms on the left and click Analyze to get started.</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
                            <p className="text-gray-500 text-lg">Analyzing symptoms using AI model...</p>
                        </div>
                    )}

                    {predictedDisease && !showChat && !isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 bg-emerald-50/30">
                            <Stethoscope className="h-16 w-16 text-emerald-600 mb-6" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h3>
                            <p className="text-gray-600 mb-8 max-w-md">Based on the symptoms provided, the model indicates a potential match for:</p>
                            <div className="bg-white border-2 border-emerald-500 text-emerald-700 px-8 py-4 rounded-2xl text-xl font-bold shadow-sm mb-8 capitalize">
                                {predictedDisease.replace(/_/g, ' ')}
                            </div>
                            <button
                                onClick={handleKnowMore}
                                className="cursor-pointer flex items-center px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                            >
                                Know more with AI
                                <ChevronRight className="h-5 w-5 ml-2" />
                            </button>
                        </div>
                    )}

                    {showChat && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                                    >
                                        <div className={`flex flex-col max-w-[85%] rounded-2xl overflow-hidden shadow-sm ${message.role === 'user'
                                                ? 'bg-emerald-600 text-white rounded-tr-sm'
                                                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                            }`}>
                                            <div className="px-6 py-4 text-sm">
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className={`text-md font-bold mt-4 mb-2 ${message.role === 'user' ? 'text-emerald-100' : 'text-emerald-800'}`} {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="pl-6 mb-4 space-y-2" style={{ listStyleType: 'disc', display: 'block' }} {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="pl-6 mb-4 space-y-2" style={{ listStyleType: 'decimal', display: 'block' }} {...props} />,
                                                        li: ({ node, ...props }) => <li className="pl-2" style={{ display: 'list-item' }} {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                                        a: ({ node, ...props }) => <a className="underline" {...props} />,
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>

                                            <div className={`px-4 py-2 flex items-center justify-between text-xs border-t ${message.role === 'user'
                                                    ? 'border-emerald-500/50 text-emerald-100'
                                                    : 'border-gray-200 text-gray-500'
                                                }`}>
                                                <span>{message.timestamp}</span>
                                                {message.role === 'assistant' && (
                                                    <button
                                                        onClick={() => generatePDF(message.content, 'single')}
                                                        className="cursor-pointer flex items-center hover:text-emerald-600 transition-colors ml-4 font-medium"
                                                        title="Download this response as PDF"
                                                    >
                                                        <FileDown className="h-3 w-3 mr-1" />
                                                        PDF
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 text-sm text-gray-500 flex items-center">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Generating response...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                                <div className="flex items-center space-x-3">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask follow-up questions..."
                                        className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm h-12"
                                        rows="1"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={isLoading || !input.trim()}
                                        className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                                    >
                                        <Send className="h-5 w-5 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SymptomAnalyzer;
