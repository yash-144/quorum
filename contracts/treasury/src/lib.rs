#![no_std]

use soroban_sdk::{
    contract, contractclient, contractimpl, contracttype, token, vec, Address, Env, String, Vec,
};

const VOTE_DURATION: u64 = 48 * 60 * 60;

#[contracttype]
#[derive(Clone)]
pub struct Proposal {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub recipient: Address,
    pub amount: i128,
    pub yes_votes: u32,
    pub no_votes: u32,
    pub total_voters: u32,
    pub deadline: u64,
    pub executed: bool,
    pub expired: bool,
    pub proposer: Address,
    pub created_at: u64,
    pub tx_hash: Option<u64>,
}

#[contracttype]
pub enum DataKey {
    Admin,
    VoteTokenContract,
    XlmTokenContract,
    ProposalCount,
    Proposal(u32),
    HasVoted(u32, Address),
    AllProposals,
}

#[contractclient(name = "VoteTokenClient")]
pub trait VoteToken {
    fn has_token(env: Env, address: Address) -> bool;
}

#[contract]
pub struct Treasury;

#[contractimpl]
impl Treasury {
    pub fn initialize(env: Env, admin: Address, vote_token_contract: Address, xlm_token_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::VoteTokenContract, &vote_token_contract);
        env.storage().instance().set(&DataKey::XlmTokenContract, &xlm_token_contract);
        env.storage().instance().set(&DataKey::ProposalCount, &0_u32);
    }

    pub fn create_proposal(
        env: Env,
        proposer: Address,
        title: String,
        description: String,
        recipient: Address,
        amount: i128,
    ) -> u32 {
        proposer.require_auth();

        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        if proposer != admin {
            panic!("not admin");
        }
        if amount <= 0 {
            panic!("amount must be positive");
        }

        let next_id = env
            .storage()
            .instance()
            .get::<DataKey, u32>(&DataKey::ProposalCount)
            .unwrap_or(0)
            + 1;

        let proposal = Proposal {
            id: next_id,
            title,
            description,
            recipient,
            amount,
            yes_votes: 0,
            no_votes: 0,
            total_voters: 0,
            deadline: env.ledger().timestamp() + VOTE_DURATION,
            executed: false,
            expired: false,
            proposer,
            created_at: env.ledger().timestamp(),
            tx_hash: None,
        };

        env.storage().persistent().set(&DataKey::Proposal(next_id), &proposal);
        env.storage().instance().set(&DataKey::ProposalCount, &next_id);

        let mut all: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::AllProposals)
            .unwrap_or(vec![&env]);
        all.push_back(next_id);
        env.storage().persistent().set(&DataKey::AllProposals, &all);

        env.events().publish(("proposal_created", next_id), proposal.amount);

        next_id
    }

    pub fn vote(env: Env, voter: Address, proposal_id: u32, approve: bool) {
        voter.require_auth();

        let vote_contract: Address = env
            .storage()
            .instance()
            .get(&DataKey::VoteTokenContract)
            .expect("vote token contract not set");

        let vt = VoteTokenClient::new(&env, &vote_contract);
        if !vt.has_token(&voter) {
            panic!("not a member");
        }

        if env
            .storage()
            .persistent()
            .get::<DataKey, bool>(&DataKey::HasVoted(proposal_id, voter.clone()))
            .unwrap_or(false)
        {
            panic!("already voted");
        }

        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&DataKey::Proposal(proposal_id))
            .expect("proposal not found");

        if proposal.executed || proposal.expired {
            panic!("proposal closed");
        }
        if env.ledger().timestamp() > proposal.deadline {
            panic!("voting closed");
        }

        if approve {
            proposal.yes_votes += 1;
        } else {
            proposal.no_votes += 1;
        }
        proposal.total_voters += 1;

        env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);
        env.storage()
            .persistent()
            .set(&DataKey::HasVoted(proposal_id, voter.clone()), &true);

        env.events().publish(("vote_cast", proposal_id), (voter, approve));
    }

    pub fn execute_proposal(env: Env, caller: Address, proposal_id: u32) {
        caller.require_auth();

        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        if caller != admin {
            panic!("not admin");
        }

        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&DataKey::Proposal(proposal_id))
            .expect("proposal not found");

        if proposal.executed {
            panic!("already executed");
        }
        if proposal.expired {
            panic!("already expired");
        }
        if env.ledger().timestamp() <= proposal.deadline {
            panic!("voting still active");
        }

        if proposal.yes_votes == 0 || proposal.yes_votes <= proposal.no_votes {
            proposal.expired = true;
            env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);
            env.events().publish(("proposal_failed", proposal_id), ());
            return;
        }

        let xlm_token_contract: Address = env
            .storage()
            .instance()
            .get(&DataKey::XlmTokenContract)
            .expect("xlm token contract not set");
        let token_client = token::Client::new(&env, &xlm_token_contract);
        token_client.transfer(&env.current_contract_address(), &proposal.recipient, &proposal.amount);

        proposal.executed = true;
        env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);

        env.events()
            .publish(("proposal_executed", proposal_id), proposal.amount);
    }

    pub fn expire_proposal(env: Env, proposal_id: u32) {
        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&DataKey::Proposal(proposal_id))
            .expect("proposal not found");

        if env.ledger().timestamp() <= proposal.deadline {
            panic!("voting still active");
        }
        if proposal.executed || proposal.expired {
            panic!("already closed");
        }

        proposal.expired = true;
        env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);
        env.events().publish(("proposal_expired", proposal_id), ());
    }

    pub fn get_proposal(env: Env, id: u32) -> Proposal {
        env.storage()
            .persistent()
            .get(&DataKey::Proposal(id))
            .expect("proposal not found")
    }

    pub fn get_all_proposals(env: Env) -> Vec<Proposal> {
        let ids: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::AllProposals)
            .unwrap_or(vec![&env]);
        let mut out: Vec<Proposal> = vec![&env];

        for id in ids.iter() {
            if let Some(p) = env.storage().persistent().get::<DataKey, Proposal>(&DataKey::Proposal(id)) {
                out.push_back(p);
            }
        }

        out
    }

    pub fn has_voted(env: Env, proposal_id: u32, voter: Address) -> bool {
        env.storage()
            .persistent()
            .get::<DataKey, bool>(&DataKey::HasVoted(proposal_id, voter))
            .unwrap_or(false)
    }

    pub fn proposal_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::ProposalCount).unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
