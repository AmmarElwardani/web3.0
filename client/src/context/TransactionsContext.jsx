import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionsContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({
    provider,
    signer,
    transactionContract,
  });
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, currentAccountSet] = useState("");
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      currentAccountSet(accounts[0]);
      console.log(accounts);
      //getAllTransactions();
    } else {
      console.log("No Accounts");
    }
    } catch (error) {
      console.error(error);
      throw new Error("No etherum object!!");
    }
    
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      currentAccountSet(accounts[0]);
    } catch (error) {
      console.error(error);
      throw new Error("No etherum object!!");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionsContext.Provider value={{ connectWallet, currentAccount }}>
      {children}
    </TransactionsContext.Provider>
  );
};
