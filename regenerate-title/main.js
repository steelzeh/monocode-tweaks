// Everything this feature does is in this file. The app only supplies
// general abilities: read a chat, ask the background model, rename a chat.
const BUDGET = 8000;
const MESSAGE_LIMIT = 2000;

const PROMPT = `Generate a title that will help the user recognize this coding session weeks later.
Do not call tools. Reply with the title only.

Before answering, silently reduce the conversation to:
- Subject: What system, feature, or problem is this really about?
- Outcome: What does the user ultimately want to understand or change?
- Incidental instructions: What only describes how the agent should do the work?

Title the subject and outcome. Discard incidental instructions.

Editorial rules:
- 3-8 words, fewer than 40 characters.
- Use a compact noun phrase or clear action phrase.
- Capture the umbrella goal when the request lists several symptoms or steps.
- Name the product change, not the mock, plan, report, branch, or PR used to produce it.
- Models, subagents, tools, and output formats do not belong in the title unless they are themselves the topic.
- Do not claim the work is complete.
- Do not copy and truncate the user's message.
- Avoid quotes, labels, filler, and trailing punctuation.

Title the whole conversation below, not only its first request. Prefer the subject the user is working on now.

Conversation:
`;

const cut = (text, count) => (text.length <= count ? text : `${text.slice(0, count)}\n\n[truncated]`);

// The first request always, then the newest messages until the budget runs out.
function conversation(messages) {
  let remaining = BUDGET;
  const chosen = new Map();
  const take = (message, ix) => {
    if (remaining < 200 || chosen.has(ix)) return;
    const section = `${message.role.toUpperCase()}:\n${cut(message.text.trim(), Math.min(MESSAGE_LIMIT, remaining - 100))}`;
    remaining -= section.length + 2;
    chosen.set(ix, section);
  };
  const first = messages.findIndex((message) => message.role === "user");
  if (first >= 0) take(messages[first], first);
  for (let ix = messages.length - 1; ix >= 0; ix--) take(messages[ix], ix);
  return [...chosen.keys()].sort((a, b) => a - b).map((ix) => chosen.get(ix)).join("\n\n");
}

function clean(answer) {
  const line = answer.trim().split("\n")[0].trim().replace(/^['"`]+|['"`]+$/g, "").replace(/\s+/g, " ");
  return line.length <= 50 ? line : `${line.slice(0, 47).trimEnd()}...`;
}

tweak.onMenu("regenerate", (chat) => {
  const text = conversation(chat.messages);
  if (!text) throw new Error("This chat has no messages to title yet.");
  tweak.setChatLoading(chat.id, true);
  tweak.askModel(PROMPT + text, (answer, error) => {
    tweak.setChatLoading(chat.id, false);
    const title = clean(answer || "");
    if (error || !title) throw new Error(error || "The model returned no title.");
    tweak.renameChat(chat.id, title);
  });
});
