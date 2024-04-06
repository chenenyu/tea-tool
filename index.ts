import * as bip39 from 'bip39';
import * as ethWallet from 'ethereumjs-wallet';
import * as fs from 'fs';
import * as solWeb3 from '@solana/web3.js';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import * as ecc from 'tiny-secp256k1';

/**
 * Convert Gwei to Ether.
 * @param {number} gwei
 * @returns {number} Ether
 */
function gweiToEther(gwei: number) {
    return gwei / 1000000000; // 1 Ether = 1,000,000,000 Gwei
}

function generateEthWallet(count?: number) {
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

function generateBtcWallet(count?: number) {
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

function generateEthAddressWithPrefixAndSuffix(prefix?: string, suffix?: string) {
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
