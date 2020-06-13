export type Chat = {
  id: number,
  displayName: string,
  lastActivity: Date,
}

export type Message = {
  id: number,
  delivered: boolean,
  fromMe: boolean,
  time: Date,
  text: string,
  attachments: Array<Attachment>,
}

// Attachment represents a url to request the attachment
export type Attachment = string

const messageAttachmentCache: Record<number, Promise<Array<Attachment>>> = {};
async function getAttachments(messageId: number): Promise<Array<Attachment>> {
  if (messageAttachmentCache[messageId] != null) {
    return await messageAttachmentCache[messageId];
  }
  messageAttachmentCache[messageId] = fetchJson<Array<string>>("GET", `/api/attachments/${messageId}`);
  return await messageAttachmentCache[messageId];
}

export async function getMessages(chatId: number): Promise<Array<Message>> {
  const res = await fetchJson<Array<{
    id: number,
    delivered: boolean,
    fromMe: boolean,
    text: string,
    time: string,
  }>>("GET", `/api/chats/${chatId}`)

  return await Promise.all(res.map(async message => ({
    ...message,
    time: new Date(message.time),
    attachments: await getAttachments(message.id),
  })))
}

export async function sendMessage(chatId: number, message: string): Promise<void> {
  await fetchJson<{}>("POST",`/api/chats/${chatId}`, {message})
}

export async function getChats(): Promise<Array<Chat>> {
  const res = await fetchJson<Array<{
    id: number,
    displayName: string,
    lastActivity: string,
  }>>("GET", "/api/chats");

  return res.map(chat => ({
    ...chat,
    lastActivity: new Date(chat.lastActivity),
  }))
}

async function fetchJson<T>(method: string, url: string, body?: Object): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return await res.json();
}

  // .map((m: any) => ({...m, date: new Date(m.date)}));

  // messages = await Promise.all(messages.map(async message =>
  //   Object.assign({}, message, {attachments: await getAttachments(message.id)})
  // ));

  // Group messages into bubble groups
  // let currentGroup: Array<Message> = [];
  // const groups = [currentGroup];
  // messages.sort((a, b) => a.time.valueOf() - b.time.valueOf()).forEach(message => {
  //   if (currentGroup.length > 0 && currentGroup[0].fromMe != message.fromMe) {
  //     currentGroup = [];
  //     groups.push(currentGroup);
  //   }
  //
  //   // Create a bubble for the text if required
  //   if (message.text.replace(/[\s\uFFFC\uFEFF\xA0]/g, "") !== "") currentGroup.push(message);
  //
  //   // Create a separate message bubble for each attachment
  //   message.attachments.forEach(attachment => currentGroup.push({
  //     id: `${message.id}${attachment}`,
  //     fromMe: message.fromMe,
  //     src: attachment,
  //   }));
  // });
  // return groups;

// export async function sendMessage(chatId: number, message: string, attachment) {
//   const formData = new FormData();
//   if (message) formData.append('message', message);
//   if (attachment) formData.append('attachment', attachment);
//   const res = await fetch(`/api/chats/${chatId}`, {
//     method: 'POST',
//     body: formData,
//   });
//   await res.json();
// }
