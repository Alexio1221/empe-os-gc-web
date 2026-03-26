"use client";

import Lottie from "lottie-react";
import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import botAnimation from "@/app/animaciones/botAnimation.json"

function generateCaptcha(length = 5): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}

interface Message {
    role: "user" | "assistant";
    text: string;
    imagePreview?: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fix hydration: string vacío en servidor, generado en useEffect (solo cliente)
    const [captchaCode, setCaptchaCode] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaError, setCaptchaError] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [modal, setModal] = useState<{
        open: boolean;
        message: string;
    }>({
        open: false,
        message: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCaptchaCode(generateCaptcha());
    }, []);

    useEffect(() => {
        if (messages.length === 0) return;
        const el = messagesContainerRef.current;
        if (!el) return;

        el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleImageChange = useCallback((file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImagePreview(result);
            setImageBase64(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
    }, []);

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageBase64(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const refreshCaptcha = () => {
        setCaptchaCode(generateCaptcha());
        setCaptchaInput("");
        setCaptchaError(false);
    };

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            setModal({
                open: true,
                message: "Por favor escribe un mensaje antes de enviar.",
            });
            return;
        }

        if (captchaInput.trim().toUpperCase() !== captchaCode) {
            setCaptchaError(true);
            refreshCaptcha();

            setModal({
                open: true,
                message: "El código CAPTCHA es incorrecto. Intenta nuevamente.",
            });
            return;
        }

        setLoading(true);
        setError("");
        setCaptchaError(false);

        const userMessage: Message = {
            role: "user",
            text: prompt,
            imagePreview: imagePreview ?? undefined,
        };
        setMessages((prev) => [...prev, userMessage]);

        const currentPrompt = prompt;
        const currentImageBase64 = imageBase64;
        const currentMimeType = imageFile?.type ?? "image/jpeg";

        setPrompt("");
        removeImage();
        refreshCaptcha();

        try {
            // Convertir historial
            const history = messages.map((msg) => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.text }],
            }));

            // Limitar historial 
            const limitedHistory = history.slice(-6);

            const body: any = {
                message: currentPrompt,
                history: limitedHistory,
            };

            if (currentImageBase64) {
                body.image = {
                    data: currentImageBase64,
                    mimeType: currentMimeType,
                };
            }

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Error del servidor:", text);

                // 💡 mejora UX
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        text: "⚠️ El servicio está ocupado, intenta en unos segundos.",
                    },
                ]);

                return;
            }

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: data.text },
            ]);

        } catch (err) {
            console.error("Error de red:", err);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "⚠️ Error de conexión. Intenta nuevamente.",
                },
            ]);

        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <main>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.headerDot} />
                    <span style={styles.headerTitle}>Asistente Empeños G&C</span>
                </div>

                <div ref={messagesContainerRef} style={styles.messagesArea}>
                    {messages.length === 0 && (
                        <div style={styles.emptyState}>
                            <Lottie
                                animationData={botAnimation}
                                loop
                                style={{ width: 150 }}
                            />
                            <p style={styles.emptyText}>¿En qué puedo ayudarte hoy?</p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.bubble,
                                ...(msg.role === "user" ? styles.bubbleUser : styles.bubbleAssistant),
                            }}
                        >
                            <span style={styles.bubbleRole}>
                                {msg.role === "user" ? "Tú" : "IA"}
                            </span>
                            {msg.imagePreview && (
                                <img
                                    src={msg.imagePreview}
                                    alt="Imagen adjunta"
                                    style={styles.bubbleImage}
                                />
                            )}
                            <div style={styles.bubbleText}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ ...styles.bubble, ...styles.bubbleAssistant }}>
                            <span style={styles.bubbleRole}>IA</span>
                            <div style={styles.loadingDots}>
                                <span style={{ ...styles.dot, animation: "dotBlink 1.2s infinite 0s" }} />
                                <span style={{ ...styles.dot, animation: "dotBlink 1.2s infinite 0.2s" }} />
                                <span style={{ ...styles.dot, animation: "dotBlink 1.2s infinite 0.4s" }} />
                            </div>
                        </div>
                    )}

                    {error && <p style={styles.errorText}>{error}</p>}
                    <div ref={bottomRef} />
                </div>

                {imagePreview && (
                    <div style={styles.imagePreviewContainer}>
                        <img src={imagePreview} alt="preview" style={styles.imagePreviewThumb} />
                        <button onClick={removeImage} style={styles.removeImageBtn} title="Quitar imagen">
                            ✕
                        </button>
                    </div>
                )}

                <div style={styles.inputArea}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe tu mensaje..."
                        style={styles.textarea}
                        rows={2}
                        disabled={loading}
                    />

                    <div style={styles.inputRow}>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={styles.attachBtn}
                            title="Adjuntar imagen"
                            disabled={loading}
                        >
                            📎
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleImageChange(f);
                            }}
                        />

                        <div style={styles.captchaGroup}>
                            <div style={styles.captchaBox}>
                                <span style={styles.captchaText}>{captchaCode}</span>
                                <button onClick={refreshCaptcha} style={styles.refreshBtn} title="Nuevo código">
                                    ↻
                                </button>
                            </div>
                            <input
                                type="text"
                                value={captchaInput}
                                onChange={(e) => {
                                    setCaptchaInput(e.target.value.toUpperCase());
                                    setCaptchaError(false);
                                }}
                                placeholder="Código"
                                maxLength={5}
                                style={{
                                    ...styles.captchaInput,
                                    ...(captchaError ? styles.captchaInputError : {}),
                                }}
                                disabled={loading}
                            />
                            {captchaError && (
                                <span style={styles.captchaErrorMsg}>✕ Incorrecto</span>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !prompt.trim()}
                            style={{
                                ...styles.sendBtn,
                                ...(loading || !prompt.trim() ? styles.sendBtnDisabled : {}),
                            }}
                        >
                            {loading ? "..." : "Enviar →"}
                        </button>
                    </div>
                </div>
                <div style={styles.footerDisclaimer}>
                    El asistente de Empeños G&C es una IA y puede cometer errores.
                </div>
            </div>
            {modal.open && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <p style={styles.modalText}>{modal.message}</p>
                        <button
                            onClick={() => setModal({ open: false, message: "" })}
                            style={styles.modalButton}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus { outline: none; border-color: #c9a84c !important; }
        input:focus { outline: none; border-color: #c9a84c !important; }
        button:hover:not(:disabled) { opacity: 0.85; }
        button { cursor: pointer; transition: opacity 0.15s; }
        button:disabled { cursor: not-allowed; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 4px; }
        @keyframes dotBlink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.7); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </main>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: "100%",
        maxWidth: 720,
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        height: "88vh",
        overflow: "hidden",
    },

    header: {
        padding: "16px 24px",
        borderBottom: "1px solid #1e293b",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        gap: 10,
    },

    headerDot: { width: 8, height: 8, borderRadius: "50%", background: "#38bdf8" },

    headerTitle: {
        color: "#e2e8f0",
        fontSize: 15,
        fontWeight: 600,
    },

    messagesArea: {
        flex: 1,
        overflowY: "auto",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "#0f172a",
    },

    emptyState: {
        flex: 1, // ocupa todo el espacio disponible
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // centra vertical
        alignItems: "center",     // centra horizontal
        textAlign: "center",
        gap: 12
    },
    emptyText: { color: "#94a3b8", fontSize: 14 },

    bubble: {
        maxWidth: "85%",
        padding: "12px 16px",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },

    bubbleUser: {
        alignSelf: "flex-end",
        background: "#2563eb",
        color: "#ffffff",
        borderRadius: "14px 14px 4px 14px",
    },

    bubbleAssistant: {
        alignSelf: "flex-start",
        background: "#1e293b",
        color: "#ffffff",
        border: "1px solid #334155",
        borderRadius: "14px 14px 14px 4px",
    },

    bubbleRole: {
        fontSize: 10,
        color: "#38bdf8",
        fontWeight: 700,
        textTransform: "uppercase",
    },

    bubbleText: {
        fontSize: 14,
        lineHeight: 1.6,
    },

    bubbleImage: {
        maxWidth: "100%",
        maxHeight: 200,
        borderRadius: 10,
        objectFit: "cover",
        marginTop: 4
    },

    loadingDots: { display: "flex", gap: 5, alignItems: "center" },
    dot: { width: 7, height: 7, borderRadius: "50%", background: "#38bdf8" },

    errorText: { color: "#f87171", fontSize: 13, textAlign: "center" },

    imagePreviewContainer: {
        margin: "0 24px 8px",
        display: "inline-flex",
        gap: 6,
        background: "#020617",
        padding: 6,
        borderRadius: 10,
        border: "1px solid #1e293b",
    },

    imagePreviewThumb: {
        width: 64,
        height: 64,
        objectFit: "cover",
        borderRadius: 8
    },

    removeImageBtn: {
        background: "#ef4444",
        border: "none",
        color: "white",
        width: 22,
        height: 22,
        borderRadius: "50%",
        cursor: "pointer",
    },

    inputArea: {
        borderTop: "1px solid #1e293b",
        padding: "16px",
        background: "#020617",
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },

    textarea: {
        width: "100%",
        background: "#111827",
        border: "2px solid #ffffff",
        borderRadius: 12,
        color: "#ffffff",
        padding: "14px 16px",
        fontSize: 14,
        resize: "none",
        lineHeight: 1.5,
    },

    inputRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap"
    },

    attachBtn: {
        background: "#111827",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "10px",
        fontSize: 18,
        color: "#38bdf8",
        cursor: "pointer",
    },

    captchaGroup: { display: "flex", alignItems: "center", gap: 8, flex: 1 },

    captchaBox: {
        background: "#111827",
        border: "1px solid #334155",
        borderRadius: 8,
        padding: "8px 12px",
        display: "flex",
        gap: 8,
    },

    captchaText: {
        fontFamily: "monospace",
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: "0.2em",
        color: "#38bdf8"
    },

    refreshBtn: {
        background: "transparent",
        border: "none",
        color: "#38bdf8",
        fontSize: 18,
        cursor: "pointer"
    },

    captchaInput: {
        background: "#111827",
        border: "2px solid #334155",
        borderRadius: 8,
        color: "#f1f5f9",
        padding: "8px",
        width: 100,
        textAlign: "center",
        fontWeight: "bold",
    },

    captchaInputError: {
        borderColor: "#ef4444",
        background: "#2a1a1a"
    },

    captchaErrorMsg: {
        color: "#ef4444",
        fontSize: 11,
        fontWeight: "bold"
    },

    sendBtn: {
        background: "#38bdf8",
        border: "none",
        borderRadius: 20,
        color: "#020617",
        padding: "10px 22px",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        marginLeft: "auto",
        boxShadow: "0 4px 10px rgba(56,189,248,0.3)",
    },

    sendBtnDisabled: {
        background: "#334155",
        color: "#94a3b8",
        boxShadow: "none"
    },

    footerDisclaimer: {
        fontSize: 11,
        color: "#64748b",
        textAlign: "center",
        padding: "8px 16px",
        borderTop: "1px solid #1e293b",
        background: "#020617",
    },

    modalOverlay: {
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
    },

    modal: {
        background: "#1e293b",
        borderRadius: 16,
        padding: "24px",
        maxWidth: 320,
        textAlign: "center",
    },

    modalText: {
        color: "#e2e8f0",
        fontSize: 15,
        marginBottom: 20,
    },

    modalButton: {
        background: "#38bdf8",
        border: "none",
        borderRadius: 10,
        padding: "10px 20px",
        color: "#020617",
        fontWeight: 600,
        cursor: "pointer",
    },
};