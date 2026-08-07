import { useState } from 'preact/hooks';

interface NewEntry {
  id: number;
  message: string;
  created_at: string;
  formattedId: string;
  identiconSvg: string;
}

const MAX = 280;

export default function GuestbookForm() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [error, setError] = useState('');

  const remaining = MAX - message.length;

  async function onSubmit(e: Event) {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 1) {
      setStatus('error');
      setError('Mesaj boş olamaz.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? 'Gönderilemedi.');
      }
      const { entry } = (await res.json()) as { entry: NewEntry };
      prependEntry(entry);
      setMessage('');
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Gönderilemedi.');
    }
  }

  return (
    <form onSubmit={onSubmit} class="border border-line bg-panel/40 p-4">
      <label for="gb-message" class="sr-only">
        Mesaj
      </label>
      <textarea
        id="gb-message"
        value={message}
        onInput={(e) => setMessage((e.currentTarget as HTMLTextAreaElement).value)}
        rows={3}
        maxlength={MAX}
        placeholder="bir satır bırak…"
        class="w-full resize-none bg-transparent text-ink placeholder:text-faint/60 focus:outline-none"
      />
      <div class="mt-3 flex items-center justify-between">
        <span class="font-mono text-xs text-faint">
          {status === 'error' ? error : `${remaining} karakter`}
        </span>
        <button
          type="submit"
          disabled={status === 'sending'}
          class="bg-mauve px-4 py-1.5 font-mono text-xs text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'sending' ? 'gönderiliyor…' : 'bırak'}
        </button>
      </div>
    </form>
  );
}

/** Mirror the server-rendered card and prepend it (XSS-safe: SVG via innerHTML, message via textContent). */
function prependEntry(entry: NewEntry): void {
  const list = document.getElementById('guestbook-entries');
  if (!list) return;

  const avatar = document.createElement('div');
  avatar.className = 'h-10 w-10 shrink-0 [&_svg]:h-full [&_svg]:w-full';
  avatar.innerHTML = entry.identiconSvg;

  const meta = document.createElement('p');
  meta.className = 'font-mono text-xs text-faint';
  meta.textContent = `${entry.formattedId} · şimdi`;

  const msg = document.createElement('p');
  msg.className = 'mt-1 text-ink leading-relaxed';
  msg.textContent = entry.message;

  const body = document.createElement('div');
  body.className = 'min-w-0 flex-1';
  body.appendChild(meta);
  body.appendChild(msg);

  const li = document.createElement('li');
  li.className = 'flex gap-4 border border-line bg-panel/40 p-4';
  li.appendChild(avatar);
  li.appendChild(body);

  list.prepend(li);
}
