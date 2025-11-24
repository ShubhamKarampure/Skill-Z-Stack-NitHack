"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🦊 Connect Wallet
   * Handles both Desktop (Extension) and Mobile (MetaMask Browser)
   */
  const connectWallet = useCallback(async () => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        setIsConnecting(true);
        setError(null);

        // @ts-ignore
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Request access
        const accounts = await provider.send("eth_requestAccounts", []);

        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          return accounts[0];
        }
      } catch (err: any) {
        console.error("Connection Error:", err);
        setError(err.message || "Failed to connect wallet");
        return null;
      } finally {
        setIsConnecting(false);
      }
    } else {
      // Logic for when provider is missing is handled by the Navbar
      // which redirects to the App Store/Deep Link
      return null;
    }
  }, []);

  /**
   * 🔌 Disconnect Wallet
   * Note: We cannot programmatically 'lock' MetaMask.
   * We simulate disconnect by clearing local state.
   */
  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnecting(false);
    setError(null);
  }, []);

  /**
   * 🎧 Event Listeners (Crucial for Production)
   * Listens for Account Changes or Network Changes
   */
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.ethereum) {
      // Handle Account Change (User switches account in wallet)
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          // User disconnected via the wallet interface
          disconnect();
        }
      };

      // Handle Chain Change (Reload page recommended by MetaMask)
      const handleChainChanged = (_chainId: string) => {
        window.location.reload();
      };

      // @ts-ignore
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      // @ts-ignore
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        // @ts-ignore
        if (window.ethereum.removeListener) {
          // @ts-ignore
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          // @ts-ignore
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [disconnect]);

  /**
   * 🔄 Auto-Check on Mount
   * Checks if we are already connected (persistent session)
   */
  useEffect(() => {
    const checkConnection = async () => {
      // @ts-ignore
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // @ts-ignore
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            setAddress(accounts[0].address);
          }
        } catch (err) {
          console.error("Auto-connect failed", err);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    address,
    connectWallet,
    disconnect,
    isConnecting,
    error,
  };
};
