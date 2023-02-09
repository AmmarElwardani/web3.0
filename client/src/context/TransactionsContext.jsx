import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionsContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, currentAccountSet] = useState("");
  const [formData, formDataSet] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, isLoadingSet] = useState(false);
  const [transactionCount, transactionCountSet] = useState(localStorage.getItem('transactionCount'));

  const handleChange = (e, name) => {
    formDataSet((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);
      if (accounts.length) {
        currentAccountSet(accounts[0]);

        console.log("connected");
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

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { addressTo, amount, keyword, message } = formData;

      const transactionContract = createEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208',
          value: parsedAmount._hex
        }]
      });
      
      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      isLoadingSet(true);
      console.log(`Loading- ${transactionHash.hash}`);
      await transactionHash.wait();
      isLoadingSet(false);
      console.log(`Success- ${transactionHas.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      transactionCountSet(transactionCount.toNumber())
      //get the data from the form
    } catch (error) {
      console.error(error);
      throw new Error("No etherum object!!");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        formDataSet,
        handleChange,
        sendTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
