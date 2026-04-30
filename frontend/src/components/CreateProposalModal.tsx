'use client';
import { type FormEvent, useState } from 'react';

type Props = {
  onSubmit: (payload: {
    title: string;
    description: string;
    recipient: string;
    amount: number;
    durationHours: number;
  }) => Promise<void>;
  disabled?: boolean;
};

const DURATION_OPTIONS = [
  { label: '24 hours', value: 24 },
  { label: '48 hours', value: 48 },
  { label: '72 hours', value: 72 },
  { label: '1 week', value: 168 },
];

export function CreateProposalModal({ onSubmit, disabled }: Props) {
  const [open, setOpen]               = useState(false);
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient]     = useState('');
  const [amount, setAmount]           = useState('');
  const [durationHours, setDuration]  = useState(48);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const reset = () => {
    setTitle(''); setDescription(''); setRecipient('');
    setAmount(''); setDuration(48); setError(null);
  };

  const close = () => { reset(); setOpen(false); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const n = Number(amount);
    if (!title.trim() || !description.trim() || !recipient.trim()) {
      setError('All fields are required'); return;
    }
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid XLM amount'); return;
    }
    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        recipient: recipient.trim(),
        amount: n,
        durationHours,
      });
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="px-4 py-2 rounded-md text-sm font-medium bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + New Proposal
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="fade-in w-full max-w-lg bg-surface border border-border rounded-xl shadow-lg overflow-hidden my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-primary">Create Proposal</h2>
              <button onClick={close} className="text-secondary hover:text-primary transition-colors text-lg leading-none">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <Field label="Title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-panel border border-border rounded-md px-3 py-2 text-sm text-primary placeholder-muted focus-visible:outline-none focus-visible:border-border-focus"
                  placeholder="Short proposal title"
                  maxLength={64}
                  required
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-panel border border-border rounded-md px-3 py-2 text-sm text-primary placeholder-muted focus-visible:outline-none focus-visible:border-border-focus min-h-[96px] resize-y"
                  placeholder="Purpose and justification for this proposal"
                  maxLength={512}
                  required
                />
              </Field>

              <Field label="Recipient Address">
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-panel border border-border rounded-md px-3 py-2 text-sm text-primary placeholder-muted font-mono focus-visible:outline-none focus-visible:border-border-focus"
                  placeholder="G…"
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Amount (XLM)">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-panel border border-border rounded-md px-3 py-2 text-sm text-primary placeholder-muted font-mono focus-visible:outline-none focus-visible:border-border-focus"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </Field>

                <Field label="Voting Period">
                  <select
                    value={durationHours}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-panel border border-border rounded-md px-3 py-2 text-sm text-primary focus-visible:outline-none focus-visible:border-border-focus"
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {error && (
                <p className="text-xs text-failed bg-failed/10 border border-failed/20 rounded px-3 py-2 font-mono">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-2 rounded-md text-sm font-medium border border-border text-secondary hover:text-primary hover:border-border-focus transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating…' : 'Submit Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-secondary uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
