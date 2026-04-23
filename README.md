# Community Treasury

Production-ready community treasury dApp for Stellar testnet.

## What is done

- Inter-contract call is implemented and tested.
- Custom vote token contract is implemented.
- Treasury contract is implemented.
- Frontend is mobile responsive.
- CI workflow runs contract tests + frontend tests + frontend build.

## Tech

- Soroban Rust contracts
- Next.js 14 + TypeScript
- Tailwind CSS
- Vitest

## Run contracts tests

```bash
cd contracts
cargo test --workspace
```

## Run frontend

```bash
cd frontend
npm install
npm test
npm run build
npm run dev
```

## Deploy to testnet

Set env values:

```bash
export ADMIN_SECRET="S..."
export ADMIN_ADDRESS="G..."
```

Run:

```bash
chmod +x scripts/deploy_testnet.sh
./scripts/deploy_testnet.sh
```

Then set contract ids in [frontend/.env.local.example](frontend/.env.local.example):

- NEXT_PUBLIC_TREASURY_CONTRACT_ID
- NEXT_PUBLIC_VOTE_TOKEN_CONTRACT_ID
- NEXT_PUBLIC_ADMIN_ADDRESSES

## CI

Workflow file: [.github/workflows/ci.yml](.github/workflows/ci.yml)

It runs on push and pull request.
