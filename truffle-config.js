module.exports = {
  networks: {

  },

// plugins: ["solidity-coverage"],

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      gasPrice:1,
      token: 'ETH',
      showTimeSpent: true,
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",      // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
};
