/**
 * Chat Sensitive Data Validator
 * Uses Chrome's built-in Prompt API (Gemini Nano) to detect credit card numbers
 * in chat messages before "sending" them.
 */

const SYSTEM_PROMPT = `You are a sensitive data detector. Your ONLY job is to check if a message contains a credit card number.
Reply with exactly one word: YES or NO.
YES = the message contains something that looks like a credit card number (typically 13-19 digits, possibly separated by spaces or dashes).
NO = the message does not contain a credit card number.
Do not explain. Reply with only YES or NO.`;

(async () => {
  const chatArea = document.getElementById("chat-area");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const aiBadge = document.getElementById("ai-badge");
  const errorBanner = document.getElementById("error-banner");
  const statusText = document.getElementById("status-text");
  const infoBtn = document.getElementById("info-btn");
  const infoModal = document.getElementById("info-modal");
  const modalClose = document.getElementById("modal-close");
  const modalOk = document.getElementById("modal-ok");

  let session = null;
  let welcomeVisible = true;

  // ── Check Prompt API availability ──
  if (!("LanguageModel" in self)) {
    aiBadge.textContent = "AI Unavailable";
    aiBadge.className = "badge badge-unavailable";
    errorBanner.classList.remove("hidden");
    sendBtn.disabled = true;
    return;
  }

  // ── Create AI session ──
  try {
    session = await LanguageModel.create({
      initialPrompts: [{ role: "system", content: SYSTEM_PROMPT }],
    });
    aiBadge.textContent = "🟢 Local AI Ready";
    aiBadge.className = "badge badge-ready";
  } catch (err) {
    console.error("Failed to create LanguageModel session:", err);
    aiBadge.textContent = "AI Error";
    aiBadge.className = "badge badge-unavailable";
    errorBanner.textContent = `Failed to initialize AI: ${err.message}`;
    errorBanner.classList.remove("hidden");
    sendBtn.disabled = true;
    return;
  }

  // ── Helpers ──
  const clearWelcome = () => {
    if (welcomeVisible) {
      const welcome = chatArea.querySelector(".welcome-message");
      if (welcome) welcome.remove();
      welcomeVisible = false;
    }
  };

  const addMessage = (text, className, icon = "") => {
    const div = document.createElement("div");
    div.className = `msg ${className}`;
    div.innerHTML = icon ? `<span class="msg-icon">${icon}</span>${text}` : text;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
    return div;
  };

  const setProcessing = (active) => {
    sendBtn.disabled = active;
    input.disabled = active;
    if (active) {
      statusText.textContent = "Analyzing message with local AI…";
    } else {
      statusText.textContent = "";
    }
  };

  // ── Handle message submission ──
  const handleSubmit = async () => {
    const text = input.value.trim();
    if (!text || !session) return;

    clearWelcome();
    addMessage(text, "msg-user");
    input.value = "";
    input.style.height = "auto";

    // Show analyzing indicator
    const analyzingMsg = addMessage(
      '<span class="spinner"></span>Analyzing for sensitive data…',
      "msg-system msg-analyzing"
    );

    setProcessing(true);

    try {
      const prompt = `Does the following message contain a credit card number? Reply YES or NO only.\n\nMessage: "${text}"`;
      const response = await session.prompt(prompt);
      const answer = response.trim().toUpperCase();

      console.log("AI response:", response, "→ parsed:", answer);

      // Remove the analyzing bubble
      analyzingMsg.remove();

      if (answer.startsWith("YES")) {
        addMessage(
          "You included sensitive information (credit card number detected). The message was <strong>not sent</strong>.",
          "msg-system msg-blocked",
          "🚫"
        );
      } else {
        addMessage(
          "Message sent. Awaiting response.",
          "msg-system msg-safe",
          "✅"
        );
      }
    } catch (err) {
      console.error("AI prompt error:", err);
      analyzingMsg.remove();
      addMessage(
        `Error analyzing message: ${err.message}`,
        "msg-system msg-blocked",
        "⚠️"
      );
    } finally {
      setProcessing(false);
      input.focus();
    }
  };

  // ── Event listeners ──
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });

  // Auto-grow textarea
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  });

  // Example cards
  document.querySelectorAll(".example-card").forEach((card) => {
    card.addEventListener("click", () => {
      input.value = card.dataset.text;
      input.dispatchEvent(new Event("input"));
      input.focus();
    });
  });

  // Modal
  infoBtn.addEventListener("click", () => infoModal.classList.remove("hidden"));
  modalClose.addEventListener("click", () => infoModal.classList.add("hidden"));
  modalOk.addEventListener("click", () => infoModal.classList.add("hidden"));
  infoModal.addEventListener("click", (e) => {
    if (e.target === infoModal) infoModal.classList.add("hidden");
  });
})();
