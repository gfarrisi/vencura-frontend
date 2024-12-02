import { UserWallet } from "@/types/user";
import api from "@/utils/api";
import { useCallback, useState } from "react";
import { parseEther } from "viem";
import { formatBalanceEth } from "./WalletBalance";

export type SendTransactionResponse =
  | {
      success: boolean;
      hash: string;
      blockNumber: number | undefined;
      gasUsed: string | undefined;
      effectiveGasPrice: string | undefined;
    }
  | { error: string };

type PayModalProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  activeWallet: UserWallet;
};

const PayModal: React.FC<PayModalProps> = ({
  opened,
  setOpened,
  activeWallet,
}) => {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const handleClose = useCallback(() => {
    setOpened(false);
    setAddress("");
    setAmount("");
    setError(undefined);
  }, [setOpened]);

  if (!opened) return null;

  const handleSend = async () => {
    console.log("Sending money to", address);
    setError(undefined);
    setLoading(true);
    if (!parseFloat(amount) || parseEther(amount) <= 0) {
      setError("Amount must be greater than 0");
      setLoading(false);
      return;
    }
    if (
      parseFloat(amount) > parseFloat(activeWallet.balance?.toString() || "0")
    ) {
      setError("Insufficient balance");
      setLoading(false);
      return;
    }

    const send = await api.post<SendTransactionResponse>(
      `wallet/${activeWallet.id}/send`,
      {
        body: JSON.stringify({
          toAddress: address,
          amount: amount,
        }),
      }
    );

    console.log("send", send);
    if ("error" in send) {
      setError(send.error);
    }
    if ("success" in send) {
      alert("Transaction sent successfully");
      handleClose();
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "1rem",
          width: "500px",
          position: "relative",
          minHeight: "200px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          onClick={handleClose}
        >
          ×
        </button>
        <h2 style={{ marginTop: 0, marginBottom: ".5rem", color: "#7B7FEE" }}>
          Send Money
        </h2>
        <div style={{ color: "black" }}>
          <p>Who would you like to send to?</p>
        </div>
        <div
          style={{
            color: "red",
            fontSize: "12px",
            height: "12px",
            marginTop: "7px",
          }}
        >
          {error}
        </div>
        <div style={{ marginTop: "7px" }}>
          <input
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              outline: "none",
              color: "black",
              backgroundColor: "#f5f5f5",
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            display: "block",
            marginBottom: "1rem",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <input
            placeholder="Enter ETH amount"
            value={!address ? "" : amount}
            disabled={!address}
            style={{
              width: "100%",
              padding: "8px 12px",
              paddingRight: "225px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              outline: "none",
              color: !address ? "#999" : "black",
              backgroundColor: "#f5f5f5",
            }}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
              pointerEvents: "none",
              fontSize: "12px",
            }}
          >
            {`${
              activeWallet ? formatBalanceEth(activeWallet.balance || 0) : 0
            } available`}
          </span>
        </div>
        <div
          style={{
            marginTop: "5px",
            color: "#7B7FEE",
            height: "12px",
            fontSize: "12px",
          }}
        >
          {loading ? "Loading..." : ""}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleSend}
            style={{
              backgroundColor: "#f499c1",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={!address}
          >
            Send
          </button>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: "#999",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayModal;
