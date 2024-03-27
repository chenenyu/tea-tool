const web3 = require('web3');

/**
 * Convert Gwei to Ether.
 * @param {number} gwei
 * @returns {number} Ether
 */
function gweiToEther(gwei) {
    return gwei / 1000000000; // 1 Ether = 1,000,000,000 Gwei
}

module.exports = {
    gweiToEther
};
