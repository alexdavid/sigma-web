const messageAttachmentCache = {};
async function getAttachments(messageId) {
  if (messageAttachmentCache[messageId] != null) {
    return await messageAttachmentCache[messageId];
  }
  messageAttachmentCache[messageId] = fetch(`/api/attachments/${messageId}`).then(res => res.json());
  return await messageAttachmentCache[messageId];
}

export async function getMessages(chatId) {
  const res = await fetch(`/api/chats/${chatId}`);
  let messages = await res.json();

  // inject message attachments
  messages = await Promise.all(messages.map(async message =>
    Object.assign({}, message, {attachments: await getAttachments(message.id)})
  ));

  // Group messages into bubble groups
  let currentGroup = [];
  const groups = [currentGroup];
  messages.sort((a, b) => new Date(a.time) - new Date(b.time)).forEach(message => {
    if (currentGroup.length > 0 && currentGroup[0].fromMe != message.fromMe) {
      currentGroup = [];
      groups.push(currentGroup);
    }

    // Create a bubble for the text if required
    if (message.text !== "\ufffc") currentGroup.push(message);

    // Create a separate message bubble for each attachment
    message.attachments.forEach(attachment => currentGroup.push({
      id: `${message.id}${attachment}`,
      fromMe: message.fromMe,
      src: attachment,
    }));
  });
  return groups;
}

export async function sendMessage(chatId, message) {
  const res = await fetch(`/api/chats/${chatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({message}),
  });
  await res.json();
}

export async function getChats() {
  const res = await fetch("/api/chats");
  return await res.json();
}
