import { useEffect, useState } from 'react';
import type { Proposal } from '../types';
import { fetchProposals } from '../lib/treasury-contract';

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProposals()
      .then((data) => {
        if (active) setProposals(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { proposals, loading };
}
