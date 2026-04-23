#![cfg(test)]

extern crate std;

use crate::{Treasury, TreasuryClient};
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    Address, Env, String,
};
use vote_token::{VoteToken, VoteTokenClient};

fn setup() -> (Env, Address, TreasuryClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1000);

    let admin = Address::generate(&env);
    let vote_token_contract = Address::generate(&env);
    let xlm_token_contract = Address::generate(&env);

    let treasury_id = env.register_contract(None, Treasury);
    let treasury = TreasuryClient::new(&env, &treasury_id);
    treasury.initialize(&admin, &vote_token_contract, &xlm_token_contract);

    (env, admin, treasury, vote_token_contract)
}

fn setup_with_token() -> (
    Env,
    Address,
    TreasuryClient<'static>,
    VoteTokenClient<'static>,
) {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1000);

    let admin = Address::generate(&env);

    let vote_token_id = env.register_contract(None, VoteToken);
    let vote_token = VoteTokenClient::new(&env, &vote_token_id);
    vote_token.initialize(&admin);

    let xlm_token_contract = Address::generate(&env);
    let treasury_id = env.register_contract(None, Treasury);
    let treasury = TreasuryClient::new(&env, &treasury_id);
    treasury.initialize(&admin, &vote_token_id, &xlm_token_contract);

    (env, admin, treasury, vote_token)
}

#[test]
fn test_create_proposal() {
    let (env, admin, treasury, _) = setup();
    let recipient = Address::generate(&env);

    let id = treasury.create_proposal(
        &admin,
        &String::from_str(&env, "buy laptop"),
        &String::from_str(&env, "for community work"),
        &recipient,
        &10_000_000,
    );

    assert_eq!(id, 1);
    let p = treasury.get_proposal(&id);
    assert_eq!(p.yes_votes, 0);
    assert_eq!(p.no_votes, 0);
    assert_eq!(p.executed, false);
}

#[test]
fn test_expire_after_deadline() {
    let (env, admin, treasury, _) = setup();
    let recipient = Address::generate(&env);

    let id = treasury.create_proposal(
        &admin,
        &String::from_str(&env, "event budget"),
        &String::from_str(&env, "for meetup"),
        &recipient,
        &5_000_000,
    );

    env.ledger().set_timestamp(1000 + (48 * 60 * 60) + 1);
    treasury.expire_proposal(&id);

    let p = treasury.get_proposal(&id);
    assert!(p.expired);
}

#[test]
fn test_inter_contract_member_vote() {
    let (env, admin, treasury, vote_token) = setup_with_token();
    let recipient = Address::generate(&env);

    let id = treasury.create_proposal(
        &admin,
        &String::from_str(&env, "new chairs"),
        &String::from_str(&env, "for community hall"),
        &recipient,
        &12_000_000,
    );

    let member = Address::generate(&env);
    vote_token.mint(&member, &1);

    treasury.vote(&member, &id, &true);

    let p = treasury.get_proposal(&id);
    assert_eq!(p.yes_votes, 1);
    assert_eq!(p.no_votes, 0);
    assert_eq!(p.total_voters, 1);
}
