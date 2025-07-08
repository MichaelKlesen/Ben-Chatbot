let apiKey = localStorage.getItem("openai_key") || "";

if (!apiKey) {
  apiKey = prompt("Bitte gib deinen OpenAI API-Schlüssel ein:");
  if (apiKey) {
    localStorage.setItem("openai_key", apiKey);
  } else {
    alert("Kein Schlüssel eingegeben. Der Chat funktioniert nicht ohne.");
  }
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;
  if (!message || !apiKey) return;

  addMessage("Ben", message, "user");
  input.value = "";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Du bist ein freundlicher, kindgerechter Chatbot für einen 12-jährigen Jungen namens Ben. Du erklärst Dinge leicht verständlich, vermeidest unangemessene Themen und stellst gerne lustige Rätsel oder Wissensfragen." },
        { role: "user", content: message }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Hoppla, da ging etwas schief.";
  addMessage("Bot", reply, "bot");
}

function addMessage(sender, text, cls) {
  const container = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = cls;
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
