"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, ShieldCheck, Info, Mic, Square, Volume2 } from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";

type Message = {
  id: string;
  role: "user" | "sprout";
  content: string;
  audioBase64?: string | null;
};

export default function SproutTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "sprout",
      content: "Hi there! I'm Sprout 🌱. What are you curious about today? We can explore science, history, space, or anything else you're wondering about!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAudioPlayback = (base64Audio: string) => {
    if (audioPlayerRef.current) {
      const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        sendAudioToServer(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to talk to Sprout!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    setIsTyping(true);
    
    // We add a placeholder user message since we don't know the transcribed text yet
    const placeholderId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: placeholderId,
      role: "user",
      content: "🎤 (Voice Message)",
    }]);

    try {
      const history = messages
        .filter(m => m.id !== "1") // Skip the initial greeting
        .map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));

      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("history", JSON.stringify(history));

      const res = await fetch("/api/generate-tutor", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Update the placeholder with the actual transcribed text
      if (data.transcribedMessage) {
        setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: data.transcribedMessage } : m));
      }

      const sproutMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "sprout",
        content: data.reply,
        audioBase64: data.audio,
      };

      setMessages(prev => [...prev, sproutMsg]);
      
      if (data.audio) {
        handleAudioPlayback(data.audio);
      }
    } catch (err) {
      console.error("Tutor error:", err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "sprout",
        content: "Oops! My brain got a little tangled there. 🤔 Could you try asking that again?",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const history = [...messages, userMsg]
        .filter(m => m.id !== "1")
        .map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));

      const formData = new FormData();
      formData.append("message", userMsg.content);
      formData.append("history", JSON.stringify(history));

      const res = await fetch("/api/generate-tutor", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const sproutMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "sprout",
        content: data.reply,
        audioBase64: data.audio,
      };

      setMessages(prev => [...prev, sproutMsg]);

      if (data.audio) {
        handleAudioPlayback(data.audio);
      }
    } catch (err) {
      console.error("Tutor error:", err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "sprout",
        content: "Oops! My brain got a little tangled there. 🤔 Could you try asking that again?",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-sprout-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <audio ref={audioPlayerRef} className="hidden" />
      
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-sprout-500 shadow-glow-emerald mb-2">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-emerald-950">
            Sprout the Tutor
          </h1>
          <p className="text-lg text-gray-600 font-body">
            Ask any question. I'll help you find the answer yourself!
          </p>
        </div>

        {/* Safety Badge */}
        <div className="bg-emerald-100/50 border border-emerald-200 rounded-xl p-3 flex items-center justify-center gap-3 max-w-xl mx-auto w-full">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-heading font-semibold text-emerald-800">
            100% Kid-Safe AI • No PII Collected • Voice Chat Enabled
          </span>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-sprout-100 flex flex-col overflow-hidden min-h-[500px] max-h-[700px]">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl shadow-sm ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-gradient-to-br from-emerald-400 to-sprout-500'}`}>
                  {msg.role === 'user' ? '👤' : '🌱'}
                </div>
                
                <div className={`px-5 py-4 rounded-2xl font-body text-lg group ${
                  msg.role === 'user' 
                    ? 'bg-indigo-50 text-indigo-900 rounded-tr-none border border-indigo-100' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <p>{msg.content}</p>
                    {msg.audioBase64 && (
                      <button 
                        onClick={() => handleAudioPlayback(msg.audioBase64!)}
                        className="text-gray-400 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Replay Audio"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl shadow-sm bg-gradient-to-br from-emerald-400 to-sprout-500">
                  🌱
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-gray-100 rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Why is the sky blue? Or click the mic to talk!"
                className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 outline-none transition-all font-body text-gray-700 text-lg"
                disabled={isTyping || isRecording}
              />
              
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all animate-pulse flex-shrink-0"
                  aria-label="Stop recording"
                >
                  <Square className="w-6 h-6 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isTyping || !!input.trim()}
                  className="w-14 h-14 bg-white border-2 border-emerald-200 text-emerald-500 hover:bg-emerald-50 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  title="Talk to Sprout"
                >
                  <Mic className="w-6 h-6" />
                </button>
              )}

              <button
                type="submit"
                disabled={!input.trim() || isTyping || isRecording}
                className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" />
              Sprout is an AI. It can make mistakes, so verify facts with a grown-up!
            </p>
          </div>
        </div>

        {/* SEO Bottom */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Voice-Enabled Socratic Learning</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              When a child asks a question, the easiest thing to do is give them the answer. However, educational research shows that true comprehension and critical thinking skills are developed when children are guided to deduce the answers themselves. Sprout the Tutor is explicitly instructed to act as a "Socratic Tutor". 
              Now, with our new <strong>Voice Mode</strong>, even younger children can talk to Sprout and hear its encouraging responses read aloud!
            </p>
          </section>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <AdSenseBanner slot="tutor-bottom" format="horizontal" />
        </div>

      </div>
    </div>
  );
}
