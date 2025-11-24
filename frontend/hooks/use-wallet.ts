"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsConnecting(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAddress(accounts[0]);
        return accounts[0];
      } catch (error) {
        console.error("User rejected connection", error);
        return null;
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask!");
      return null;
    }
  };

  // Auto-check on mount
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) setAddress(accounts[0]);
        });
    }
  }, []);

  return { address, connectWallet, isConnecting };
};
