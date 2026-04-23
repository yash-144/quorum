#![cfg(test)]

extern crate std;

use crate::{VoteToken, VoteTokenClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

fn setup() -> (Env, Address, VoteTokenClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, VoteToken);
    let client = VoteTokenClient::new(&env, &contract_id);
    client.initialize(&admin);

    (env, admin, client)
}

#[test]
fn test_mint_and_balance() {
    let (env, _, client) = setup();
    let member = Address::generate(&env);

    client.mint(&member, &1);

    assert_eq!(client.balance(&member), 1);
    assert!(client.has_token(&member));
}

#[test]
fn test_burn() {
    let (env, _, client) = setup();
    let member = Address::generate(&env);

    client.mint(&member, &3);
    assert_eq!(client.total_supply(), 3);

    client.burn(&member);
    assert_eq!(client.balance(&member), 0);
    assert!(!client.has_token(&member));
    assert_eq!(client.total_supply(), 0);
}

#[test]
fn test_members_list() {
    let (env, _, client) = setup();
    let m1 = Address::generate(&env);
    let m2 = Address::generate(&env);

    client.mint(&m1, &1);
    client.mint(&m2, &1);

    let members = client.members();
    assert_eq!(members.len(), 2);
}
