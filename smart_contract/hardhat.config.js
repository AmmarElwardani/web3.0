// https://eth-goerli.g.alchemy.com/v2/GmAXIh5RkAn8faNjuPRDrqTY-m5YQWm4

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/GmAXIh5RkAn8faNjuPRDrqTY-m5YQWm4',
      accounts: ['f635e02c4670fb043b12846c154934eca4d0cdd983075c500d872b038b9f7fe5']
    }
  }
}