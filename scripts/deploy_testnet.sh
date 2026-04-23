#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${ADMIN_SECRET:-}" ]]; then
  echo "ADMIN_SECRET is missing"
  exit 1
fi

if [[ -z "${ADMIN_ADDRESS:-}" ]]; then
  echo "ADMIN_ADDRESS is missing"
  exit 1
fi

NETWORK=testnet

soroban config network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  || true

soroban keys add admin --secret-key "$ADMIN_SECRET" || true

pushd contracts > /dev/null
cargo build --target wasm32-unknown-unknown --release -p vote-token -p treasury

VOTE_TOKEN_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/vote_token.wasm \
  --source admin \
  --network "$NETWORK")

echo "VOTE_TOKEN_ID=$VOTE_TOKEN_ID"

XLM_CONTRACT_ID=$(soroban contract id asset \
  --asset native \
  --source admin \
  --network "$NETWORK")

echo "XLM_CONTRACT_ID=$XLM_CONTRACT_ID"

TREASURY_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/treasury.wasm \
  --source admin \
  --network "$NETWORK")

echo "TREASURY_ID=$TREASURY_ID"

soroban contract invoke \
  --id "$VOTE_TOKEN_ID" \
  --source admin \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDRESS"

soroban contract invoke \
  --id "$TREASURY_ID" \
  --source admin \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDRESS" \
  --vote_token_contract "$VOTE_TOKEN_ID" \
  --xlm_token_contract "$XLM_CONTRACT_ID"

echo "Deploy done"
popd > /dev/null
