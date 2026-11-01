# ERC-20 代币合约开发 · 接单样品

> 标准代币智能合约的设计、开发、测试与部署服务。本仓库是一个**已真实部署上链、可公开核验**的完整样品。

## 在线样品（Sepolia 测试网，点开即查）

| 项目 | 链接 |
|---|---|
| 代币 | Demo Token（DEMO），固定总量 10 亿 |
| 合约地址 | `0x05F98Dafa3e5F3Fe9DA6b64D441F0d1192a362e3` |
| 区块浏览器 | https://sepolia.etherscan.io/token/0x05F98Dafa3e5F3Fe9DA6b64D441F0d1192a362e3 |
| 源码验证 | Sourcify exact_match（链上字节码与本仓库源码逐字一致） |

链上实测记录：转账 1000 DEMO 足额到账、销毁 100 DEMO 后总量降至 999,999,900，交易哈希见 [案例报告](CASE-STUDY.md)。

## 样品合约的特点

- **固定总量，合约内没有增发函数** —— 部署后任何人（包括开发者）都无法增发
- **0 交易税**，无黑名单、无暂停、无转账限额 —— 没有中心化埋雷点
- 持有者可自愿销毁自己的代币（通缩可选）
- 基于 **OpenZeppelin Contracts v5**（业界标准审计库），Solidity 0.8.24，非可升级合约
- **单元测试 10/10 通过**，**Slither 静态扫描中高危 0 项**

## 提供什么服务

| 版本 | 内容 | 测试期报价 |
|---|---|---|
| 标准版 | 固定总量代币合约（可销毁）+ 单元测试 + 测试网部署演示 + 源码验证 | **299 元起** |
| 进阶版 | 标准版 + 交易税/多钱包分配 / 锁仓线性释放 / 防巨鲸限额（任选组合） | **599 元起** |
| 定制版 | 质押、NFT（ERC-721/1155）、空投分发等其他合约 | 面议，先聊需求再报价 |

交付物：合约源码、测试用例与测试报告、部署脚本、测试报告（含链上交易哈希）、部署与验证操作记录。

## 工作流程

1. 聊需求 → 定参数表（名称/符号/总量/功能开关），书面确认再动手
2. 写合约 + 单元测试，本地全量跑通
3. 测试网部署，你先在测试网验收（转账/销毁/分配都可实测）
4. 你确认后才谈主网：主网部署用**你自己的钱包**点确认，私钥永远不经手他人

## 技术栈

Solidity · OpenZeppelin · Hardhat · ethers.js · Slither · Foundry（按项目选用）

## 本地运行样品

```bash
npm install
npx hardhat test          # 跑全部单元测试
npx hardhat run scripts/deploy.js            # 本地链部署
```

真实测试网部署参考 `scripts/deploy-raw.js`（本地签名、裸交易广播）；需要你自备测试网钱包文件 `.testnet-wallet.json`（格式见 `.testnet-wallet.example.json`），切勿把真实私钥提交到任何仓库。

## 合规边界（先说清）

本服务只提供**智能合约技术开发**。不提供、不协助：代币发行募资（ICO/预售）、收益承诺、代运营炒作、规避监管的安排。涉及公众资金的主网项目，请先取得你所在法域的专业法律意见。

## 联系

- 微信 / 邮箱：`[待填写]`

---

## English summary

Smart-contract development service (ERC-20 / BEP-20 tokens, NFTs, staking, vesting). The token in this repo is a live, verifiable sample deployed on Sepolia testnet: fixed 1B supply, no mint function, 0% tax, burnable, built on OpenZeppelin v5 — 10/10 unit tests passing, 0 medium+ Slither findings, source verified as an exact match on Sourcify. Testnet demo first, mainnet only with your own wallet and your own legal review. Development services only — no fundraising, no token-sale or return-promising services.
