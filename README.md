# Community Treasury

A decentralized governance application built on Stellar Soroban. Members create funding proposals, vote on them, and elected admins execute approved payments from a shared treasury — all recorded on-chain.

[![CI / CD](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)

> **Live demo:** [https://YOUR_VERCEL_URL.vercel.app](https://YOUR_VERCEL_URL.vercel.app) *(update after Vercel deploy)*

---

## Screenshots

### Desktop

> Add a screenshot here after first deploy.

### Mobile

> Add a mobile screenshot here after first deploy.

---

## Features

- Connect Freighter wallet (Stellar Testnet)
- Create governance proposals with title, description, recipient address, XLM amount, and voting deadline
- Vote Yes or No — one vote per wallet per proposal
- Proposals automatically resolve to Passed, Failed, or Expired when the deadline passes
- Admins execute passed proposals, deducting from the treasury balance
- Admin panel for minting VOTE tokens and managing member balances
- Live activity feed and treasury stats dashboard
- Help panel with full usage instructions

---

## Contract Addresses (Stellar Testnet)

| Contract | Address |
|---|---|
| Treasury | `CBGEM54EBBD2J6MLMR6DDFUO6UZBZMVL2YL4C2PSFNVA6BXQWA4CRSVY` |
| Vote Token | `CDHIRXDOA66YHN64AEJJDRJB7TRIL7YWBEB24V5V4YRGF4DT4GVYLSSF` |
| Native XLM (asset) | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |

**Admin address:** `GCMTUDJI5KG7LKSOB6MHK6SOKF6H6AS67VLQYGM3ZTXRGTHPSS47YDRG`

### Deployment transactions

| Step | Transaction |
|---|---|
| Vote Token WASM upload | [`d7d5607c…`](https://stellar.expert/explorer/testnet/tx/d7d5607cd67e0391cbbdf0ed6a869c18debf22f65fd20e8bdf42a8e139c7551e) |
| Vote Token deploy | [`b9f88c7f…`](https://stellar.expert/explorer/testnet/tx/b9f88c7fa864f7f3b6323ec0740e1804a4d82c229623a84440e9a41917610c1f) |
| Vote Token initialize | [`925e26b3…`](https://stellar.expert/explorer/testnet/tx/925e26b35b31a46e3ec13190bd4bb1cf63ef63baeec2d38681e264910ef9f824) |
| Treasury WASM upload | [`dc34a6e2…`](https://stellar.expert/explorer/testnet/tx/dc34a6e2f2bf9d558929c65ad8fbeb0ada76d9818913b3ce188916c7ef5ac2e2) |
| Treasury deploy | [`10270d2a…`](https://stellar.expert/explorer/testnet/tx/10270d2a50dcfbcca27a04c623bfa477d5afa41a6f10337a919f39f70ac820a0) |
| Treasury initialize | [`5f205b7e…`](https://stellar.expert/explorer/testnet/tx/5f205b7e87e1e3390b237081e85e68c028ce8b547cb3507f0b2ec31855cea2e4) |

---

## Repository Structure

```
.
├── contracts/
│   ├── treasury/       # Soroban smart contract — proposal lifecycle, voting, execution
│   └── vote-token/     # Soroban smart contract — VOTE token minting and membership
├── frontend/           # Next.js 14 application (App Router)
│   ├── src/
│   │   ├── app/        # Root layout and page
│   │   ├── components/ # UI components
│   │   ├── hooks/      # React hooks (wallet, proposals, members, events)
│   │   ├── lib/        # Contract adapters, helpers, cache
│   │   └── types/      # Shared TypeScript types
└── scripts/
    └── deploy_testnet.sh  # One-shot contract deployment script
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contracts | Rust, Soroban SDK 22.x |
| Frontend framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Wallet | Freighter (`@stellar/freighter-api` v4) |
| Stellar SDK | `@stellar/stellar-sdk` |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

---

## Local Development

### Prerequisites

- Node.js 20+
- Rust stable with `wasm32-unknown-unknown` target
- [Stellar CLI](https://github.com/stellar/stellar-cli) (`cargo install stellar-cli`)
- [Freighter](https://freighter.app) browser extension set to **Testnet**

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/frontend
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# The file is pre-configured with the deployed testnet contracts.
# Set NEXT_PUBLIC_ADMIN_ADDRESSES to your own Freighter testnet address
# if you want admin access locally.
```

### 3. Run the dev server

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Build contracts (optional — contracts are already deployed)

```bash
cd ../contracts
stellar contract build
```

### 5. Deploy contracts to a fresh testnet account

```bash
cd ..
bash scripts/deploy_testnet.sh
# Copy the printed contract IDs into frontend/.env.local
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request:

| Job | Trigger | Steps |
|---|---|---|
| **Contracts** | push / PR | Rust toolchain setup → Cargo test → WASM build |
| **Frontend** | push / PR | Node 20 setup → `npm ci` → TypeScript type-check → production build |
| **Deploy** | push to `main` | Vercel CLI pull → build → deploy |

To enable the deploy step, add a `VERCEL_TOKEN` secret to your GitHub repository settings (Settings → Secrets → Actions).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_TREASURY_CONTRACT_ID` | Yes | Deployed treasury contract address |
| `NEXT_PUBLIC_VOTE_TOKEN_CONTRACT_ID` | Yes | Deployed vote-token contract address |
| `NEXT_PUBLIC_ADMIN_ADDRESSES` | Yes | Comma-separated admin Stellar addresses |
| `NEXT_PUBLIC_HORIZON_URL` | No | Horizon RPC URL (defaults to testnet) |

---

## Roles

| Role | How assigned | Capabilities |
|---|---|---|
| Admin | Address listed in `NEXT_PUBLIC_ADMIN_ADDRESSES` | Execute proposals, manage members |
| Member | Holds VOTE tokens minted by admin | Create proposals, vote |
| Guest | Any connected wallet | Create proposals, vote |

---

## License

MIT
