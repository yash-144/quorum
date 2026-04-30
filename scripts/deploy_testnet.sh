#!/usr/bin/env bash
set -euo pipefail
NETWORK=testnet
stellar keys generate --network testnet --fund admin || true
ADMIN_ADDRESS=$(stellar keys address admin)
pushd contracts > /dev/null
cargo build --target wasm32-unknown-unknown --release -p vote-token -p treasury
VOTE_TOKEN_ID=$(stellar contract deploy --wasm target/wasm32-unknown-unknown/release/vote_token.wasm --source-account admin --network "$NETWORK")
echo "VOTE_TOKEN_ID=$VOTE_TOKEN_ID"
XLM_CONTRACT_ID=$(stellar contract id asset --asset native --network "$NETWORK")
echo "XLM_CONTRACT_ID=$XLM_CONTRACT_ID"
TREASURY_ID=$(stellar contract deploy --wasm target/wasm32-unknown-unknown/release/treasury.wasm --source-account admin --network "$NETWORK")
echo "TREASURY_ID=$TREASURY_ID"
stellar contract invoke --id "$VOTE_TOKEN_ID" --source-account admin --network "$NETWORK" -- initialize --admin "$ADMIN_ADDRESS" || true
stellar contract invoke --id "$TREASURY_ID" --source-account admin --network "$NETWORK" -- initialize --admin "$ADMIN_ADDRESS" --vote_token_contract "$VOTE_TOKEN_ID" --xlm_token_contract "$XLM_CONTRACT_ID" || true
popd > /dev/null
