'use client';
import { type FormEvent, useState } from 'react';
import type { Member } from '../types';
import { truncateAddress } from '../lib/stellar';

type Props = {
  enabled: boolean;
  members: Member[];
  onAddMember: (address: string, amount: number) => Promise<void>;
  onUpdateMember: (address: string, newBalance: number) => Promise<void>;
  onRemoveMember: (address: string) => Promise<void>;
};

type Feedback = { type: 'success' | 'error'; msg: string } | null;

// ─── Add Member form ────────────────────────────────────────────────────────
function AddMemberForm({
  onAdd,
}: {
  onAdd: (address: string, amount: number) => Promise<void>;
}) {
  const [address, setAddress] = useState('');
  const [amount, setAmount]   = useState('100');
  const [busy, setBusy]       = useState(false);
  const [fb, setFb]           = useState<Feedback>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFb(null);
    const n = Number(amount);
    if (!address.trim()) { setFb({ type: 'error', msg: 'Address is required' }); return; }
    if (!Number.isFinite(n) || n <= 0) { setFb({ type: 'error', msg: 'Amount must be positive' }); return; }
    try {
      setBusy(true);
      await onAdd(address.trim(), n);
      setFb({ type: 'success', msg: `Added ${n} VOTE to ${address.slice(0, 8)}…` });
      setAddress(''); setAmount('100');
    } catch (err) {
      setFb({ type: 'error', msg: err instanceof Error ? err.message : 'Failed' });
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-panel border border-border rounded-md px-3 py-2 text-sm text-primary font-mono placeholder-muted focus-visible:outline-none focus-visible:border-border-focus w-full"
          placeholder="G… address"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-panel border border-border rounded-md px-3 py-2 text-sm text-primary font-mono placeholder-muted focus-visible:outline-none focus-visible:border-border-focus w-full sm:w-24"
          type="number" min="1" step="1" placeholder="VOTE"
        />
      </div>
      {fb && (
        <p className={`text-xs font-mono px-3 py-2 rounded border ${
          fb.type === 'success' ? 'text-passed bg-passed/10 border-passed/20' : 'text-failed bg-failed/10 border-failed/20'
        }`}>{fb.msg}</p>
      )}
      <button
        type="submit" disabled={busy}
        className="py-2 rounded-md text-sm font-medium bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50"
      >
        {busy ? 'Adding…' : '+ Add / Mint'}
      </button>
    </form>
  );
}

// ─── Inline editable member row ──────────────────────────────────────────────
function MemberRow({
  member,
  onUpdate,
  onRemove,
}: {
  member: Member;
  onUpdate: (address: string, newBalance: number) => Promise<void>;
  onRemove: (address: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(String(member.tokenBalance));
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const saveEdit = async () => {
    const n = Number(draft);
    if (!Number.isFinite(n) || n < 0) { setError('Invalid balance'); return; }
    try {
      setBusy(true); setError(null);
      await onUpdate(member.address, n);
      setEditing(false);
    } catch (err) { setError(err instanceof Error ? err.message : 'Update failed'); }
    finally { setBusy(false); }
  };

  const doRemove = async () => {
    if (!confirm(`Remove ${truncateAddress(member.address)} from DAO?`)) return;
    try {
      setBusy(true); setError(null);
      await onRemove(member.address);
    } catch (err) { setError(err instanceof Error ? err.message : 'Remove failed'); }
    finally { setBusy(false); }
  };

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-3 py-2 bg-panel border border-border rounded-md">
        {/* Address */}
        <span className="font-mono text-xs text-secondary flex-1 min-w-0 truncate" title={member.address}>
          {truncateAddress(member.address)}
        </span>

        {/* Balance — editable */}
        {editing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-20 bg-bg border border-border-focus rounded px-2 py-0.5 text-xs font-mono text-primary focus-visible:outline-none"
            type="number" min="0" autoFocus
          />
        ) : (
          <span className="text-xs font-mono font-medium text-primary flex-shrink-0">
            {member.tokenBalance} <span className="text-muted">VOTE</span>
          </span>
        )}

        {/* Action buttons */}
        {editing ? (
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={saveEdit} disabled={busy}
              className="px-2 py-0.5 text-[10px] font-medium bg-passed/20 text-passed border border-passed/30 rounded hover:bg-passed/30 transition-colors disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setDraft(String(member.tokenBalance)); setError(null); }}
              className="px-2 py-0.5 text-[10px] font-medium border border-border text-secondary rounded hover:text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => { setEditing(true); setDraft(String(member.tokenBalance)); }}
              className="px-2 py-0.5 text-[10px] font-medium border border-border text-secondary rounded hover:border-accent hover:text-accent-light transition-colors"
              title="Edit balance"
            >
              Edit
            </button>
            <button
              onClick={doRemove} disabled={busy}
              className="px-2 py-0.5 text-[10px] font-medium border border-failed/30 text-failed rounded hover:bg-failed/10 transition-colors disabled:opacity-50"
              title="Remove member"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-failed font-mono px-3">{error}</p>
      )}
    </li>
  );
}

// ─── Main AdminPanel ─────────────────────────────────────────────────────────
export function AdminPanel({ enabled, members, onAddMember, onUpdateMember, onRemoveMember }: Props) {
  if (!enabled) return null;

  return (
    <section className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Admin — Member Management</h2>
        <span className="text-xs font-mono text-muted bg-panel border border-border px-2 py-0.5 rounded">
          {members.length} members
        </span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-5">
        {/* Add form */}
        <div>
          <p className="text-xs text-secondary mb-3 uppercase tracking-wide">Add / Mint Tokens</p>
          <AddMemberForm onAdd={onAddMember} />
        </div>

        {/* Member list with edit/remove */}
        {members.length > 0 && (
          <div>
            <p className="text-xs text-secondary mb-3 uppercase tracking-wide">Current Members</p>
            <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {members.map((m) => (
                <MemberRow
                  key={m.address}
                  member={m}
                  onUpdate={onUpdateMember}
                  onRemove={onRemoveMember}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
