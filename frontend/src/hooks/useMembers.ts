import { useEffect, useState } from 'react';
import type { Member } from '../types';
import { fetchMembers } from '../lib/token-contract';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMembers()
      .then((data) => {
        if (active) setMembers(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { members, loading };
}
