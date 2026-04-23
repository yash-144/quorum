#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, vec, Address, Env, Vec,
};

#[contracttype]
pub enum DataKey {
    Admin,
    Balance(Address),
    Members,
    TotalSupply,
}

#[contract]
pub struct VoteToken;

#[contractimpl]
impl VoteToken {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalSupply, &0_u64);
    }

    pub fn mint(env: Env, to: Address, amount: u64) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        admin.require_auth();

        let balance: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(to.clone()))
            .unwrap_or(0);
        env.storage()
            .persistent()
            .set(&DataKey::Balance(to.clone()), &(balance + amount));

        let mut members: Vec<Address> = env
            .storage()
            .persistent()
            .get(&DataKey::Members)
            .unwrap_or(vec![&env]);
        if !members.contains(&to) {
            members.push_back(to.clone());
            env.storage().persistent().set(&DataKey::Members, &members);
        }

        let supply: u64 = env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalSupply, &(supply + amount));

        env.events().publish(("token_minted",), (to, amount));
    }

    pub fn burn(env: Env, from: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        admin.require_auth();

        let balance: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(from.clone()))
            .unwrap_or(0);
        if balance == 0 {
            panic!("no balance");
        }

        env.storage().persistent().set(&DataKey::Balance(from.clone()), &0_u64);

        let supply: u64 = env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalSupply, &(supply - balance));

        env.events().publish(("token_burned",), (from, balance));
    }

    pub fn balance(env: Env, address: Address) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(address))
            .unwrap_or(0)
    }

    pub fn has_token(env: Env, address: Address) -> bool {
        let balance: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(address))
            .unwrap_or(0);
        balance > 0
    }

    pub fn total_supply(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0)
    }

    pub fn members(env: Env) -> Vec<Address> {
        env.storage()
            .persistent()
            .get(&DataKey::Members)
            .unwrap_or(vec![&env])
    }

    pub fn admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set")
    }
}

#[cfg(test)]
mod test;
