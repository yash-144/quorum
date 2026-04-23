'use client';

import { useState } from 'react';

export function CreateProposalModal() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="rounded border border-accent px-3 py-2 text-sm"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'New Proposal'}
      </button>
      {open ? (
        <div className="mt-3 rounded border border-border bg-card p-3 text-sm text-secondary">
          Proposal form placeholder
        </div>
      ) : null}
    </div>
  );
}
