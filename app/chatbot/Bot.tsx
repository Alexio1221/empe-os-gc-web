"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

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

    // ✅ Fix hydration: string vacío en servidor, generado en useEffect (solo cliente)
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
            const body: any = { prompt: currentPrompt };
            if (currentImageBase64) {
                body.image = { data: currentImageBase64, mimeType: currentMimeType };
            }

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Error del servidor:", text);
                setError("Hubo un error al obtener la respuesta.");
                return;
            }

            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: data.text },
            ]);
        } catch (err) {
            console.error("Error de red:", err);
            setError("Error de conexión. Intenta de nuevo.");
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
                    <span style={styles.headerTitle}>Asistente IA</span>
                </div>

                <div ref={messagesContainerRef} style={styles.messagesArea}>
                    {messages.length === 0 && (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>✦</span>
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
                        placeholder="Escribe tu mensaje... (Enter para enviar)"
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
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        height: "88vh",
        overflow: "hidden",
    },
    header: {
        padding: "16px 24px",
        borderBottom: "1px solid #222",
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    headerDot: { width: 8, height: 8, borderRadius: "50%", background: "#c9a84c" },
    headerTitle: {
        color: "#e0e0e0",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
    },
    messagesArea: {
        flex: 1,
        overflowY: "auto",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
    },
    emptyState: { margin: "auto", textAlign: "center", opacity: 0.3 },
    emptyIcon: { fontSize: 32, color: "#c9a84c", display: "block", marginBottom: 10 },
    emptyText: { color: "#999", fontSize: 14, fontFamily: "'DM Mono', monospace" },
    bubble: {
        maxWidth: "80%",
        padding: "12px 16px",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },
    bubbleUser: { alignSelf: "flex-end", background: "#1e1a10", border: "1px solid #3d3010" },
    bubbleAssistant: { alignSelf: "flex-start", background: "#1a1a1a", border: "1px solid #2a2a2a" },
    bubbleRole: {
        fontSize: 11,
        fontFamily: "'DM Mono', monospace",
        color: "#c9a84c",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },
    bubbleText: {
        color: "#d4d4d4",
        fontSize: 14,
        lineHeight: 1.6,
    },
    bubbleImage: { maxWidth: "100%", maxHeight: 180, borderRadius: 8, objectFit: "cover", border: "1px solid #333" },
    loadingDots: { display: "flex", gap: 5, alignItems: "center" },
    dot: { width: 7, height: 7, borderRadius: "50%", background: "#c9a84c", display: "inline-block" },
    errorText: { color: "#e05555", fontSize: 13, textAlign: "center", padding: "8px 0", fontFamily: "'DM Mono', monospace" },
    imagePreviewContainer: { margin: "0 24px 8px", display: "inline-flex", alignItems: "flex-start", gap: 6, width: "fit-content" },
    imagePreviewThumb: { width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #3a3a3a" },
    removeImageBtn: { background: "#333", border: "none", color: "#ccc", width: 20, height: 20, borderRadius: "50%", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" },
    inputArea: { borderTop: "1px solid #222", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 },
    textarea: {
        width: "100%",
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 10,
        color: "#e0e0e0",
        padding: "10px 14px",
        fontSize: 14,
        resize: "none",
        fontFamily: "'Syne', sans-serif",
        lineHeight: 1.5,
        transition: "border-color 0.2s",
    },
    inputRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
    attachBtn: { background: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: 8, padding: "8px 10px", fontSize: 16, color: "#aaa", flexShrink: 0 },
    captchaGroup: { display: "flex", alignItems: "center", gap: 8, flex: 1, flexWrap: "wrap" },
    captchaBox: { background: "#111", border: "1px solid #333", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 },
    captchaText: { fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, letterSpacing: "0.35em", color: "#c9a84c", userSelect: "none" },
    refreshBtn: { background: "transparent", border: "none", color: "#666", fontSize: 16, padding: "0 2px", lineHeight: 1 },
    captchaInput: {
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 8,
        color: "#e0e0e0",
        padding: "7px 12px",
        fontSize: 14,
        width: 90,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        transition: "border-color 0.2s",
    },
    captchaInputError: { borderColor: "#8b2020", background: "#1a0e0e" },
    captchaErrorMsg: { color: "#e05555", fontSize: 11, fontFamily: "'DM Mono', monospace" },
    sendBtn: {
        background: "#c9a84c",
        border: "none",
        borderRadius: 8,
        color: "#0e0e0e",
        padding: "9px 18px",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "'Syne', sans-serif",
        letterSpacing: "0.03em",
        flexShrink: 0,
        marginLeft: "auto",
    },
    sendBtnDisabled: { background: "#2a2a2a", color: "#555" },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
    },

    modal: {
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: "20px 24px",
        maxWidth: 300,
        textAlign: "center",
    },

    modalText: {
        color: "#e0e0e0",
        fontSize: 14,
        marginBottom: 16,
    },

    modalButton: {
        background: "#c9a84c",
        border: "none",
        borderRadius: 8,
        padding: "8px 16px",
        color: "#0e0e0e",
        fontWeight: 600,
    },
};