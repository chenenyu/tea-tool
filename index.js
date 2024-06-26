"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bip39 = __importStar(require("bip39"));
const ethWallet = __importStar(require("ethereumjs-wallet"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const bip32 = __importStar(require("bip32"));
const ecc = __importStar(require("tiny-secp256k1"));
/**
 * Convert Gwei to Ether.
 * @param {number} gwei
 * @returns {number} Ether
 */
function gweiToEther(gwei) {
    return gwei / 1000000000; // 1 Ether = 1,000,000,000 Gwei
}
function generateEthWallet(count) {
    const wallets = [];
    for (let i = 0; i < (count || 1); i++) {
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const hdwallet = ethWallet.hdkey.fromMasterSeed(seed);
        const wallet = hdwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
        const address = wallet.getAddressString();
        wallets.push({
            mnemonic,
            address,
            privateKey: wallet.getPrivateKeyString(),
        });
    }
    return wallets;
}
function generateNo4EthWallet() {
    while (true) {
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const hdwallet = ethWallet.hdkey.fromMasterSeed(seed);
        const wallet = hdwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
        const address = wallet.getAddressString();
        if (address.includes('4')) {
            continue;
        }
        return {
            mnemonic,
            address,
            privateKey: wallet.getPrivateKeyString(),
        };
    }
}
function generateBtcWallet(count) {
    const wallets = [];
    for (let i = 0; i < (count || 1); i++) {
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        let bip32Factory = bip32.BIP32Factory(ecc).fromSeed(seed);
        const path = "m/44'/0'/0'/0/0";
        const child = bip32Factory.derivePath(path);
        const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: bitcoin.networks.bitcoin });
        wallets.push({
            mnemonic,
            address,
            privateKey: child.toWIF(),
        });
    }
    return wallets;
}
function generateEthAddressWithPrefixAndSuffix(prefix, suffix) {
    if (prefix && !prefix.startsWith('0x')) {
        throw new Error('Invalid prefix');
    }
    var count = 0;
    while (true) {
        count++;
        if (count % 1000 === 0) {
            console.log(`已尝试: ${count}次`);
        }
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const hdwallet = ethWallet.hdkey.fromMasterSeed(seed);
        const wallet = hdwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
        const address = wallet.getAddressString();
        if (prefix && !address.startsWith(prefix)) {
            continue;
        }
        if (suffix && !address.endsWith(suffix)) {
            continue;
        }
        return {
            mnemonic,
            address,
            privateKey: wallet.getPrivateKeyString(),
        };
    }
}
