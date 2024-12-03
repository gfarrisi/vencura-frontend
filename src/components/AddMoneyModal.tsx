import React, { useEffect, useState } from "react";
import { UserWallet } from "@/types/user";
import { IconCopy } from "@tabler/icons-react";
import { formatBalanceEth } from "./WalletBalance";
import api from "@/utils/api";
import { SendTransactionResponse } from "./PayModal";

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  userWallets: UserWallet[];
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  isOpen,
  onClose,
  wallet,
  userWallets,
}) => {
  const [hasMoreThanOneWallet, setHasMoreThanOneWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<{
    value: string;
    walletId: string;
    balance: number | string | undefined;
    label: string;
  } | null>(null);
  const [view, setView] = useState<"copyAddress" | "selectWallet">(
    "copyAddress"
  );
  const [amount, setAmount] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletOptions, setWalletOptions] = useState<
    {
      value: string;
      walletId: string;
      balance: number | string | undefined;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    setHasMoreThanOneWallet(userWallets.length > 1);
  }, [userWallets]);

  useEffect(() => {
    const otherWallets = userWallets.filter(
      (w) => w.address !== wallet.address
    );

    const options = otherWallets.map((w) => ({
      value: w.address,
      walletId: w.id,
      balance: w.balance,
      label: `(${w.address.slice(0, 6)}...${w.address.slice(-4)})`,
    }));

    setWalletOptions(options);
  }, [userWallets, wallet.address]);

  useEffect(() => {
    if (!selectedWallet) return;

    const updateBalance = async () => {
      setAmount(selectedWallet.balance?.toString() || "");
      const getBalance = await api.get<{ balance: number }>(
        `wallet/${selectedWallet.walletId}/balance`
      );
      setWalletOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.walletId === selectedWallet.walletId
            ? { ...option, balance: getBalance.balance }
            : option
        )
      );
    };

    updateBalance();
  }, [selectedWallet]);

  if (!isOpen) return null;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  console.log({ walletOptions, selectedWallet });

  const sendFunds = async () => {
    setIsSending(true);
    setError(null);
    //validate amount is number and greater than 0 and not greater than balance
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Amount must be a number greater than 0.");
      setIsSending(false);
      return;
    }
    // if (Number(amount) > Number(selectedWallet?.balance || 0)) {
    //   setError("Amount is greater than the selected wallet balance.");
    //   setIsSending(false);
    //   return;
    // }
    try {
      const response = await api.post<SendTransactionResponse>(
        `wallet/${wallet.id}/fund-from-other-wallet`,
        {
          body: JSON.stringify({
            amount: Number(amount),
            toWalletId: selectedWallet?.walletId,
            fromWalletId: wallet.id,
          }),
        }
      );
      if ("success" in response) {
        alert("Funds sent transferred from other wallet.");
        onClose();
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError("Failed to send funds");
    } finally {
      setIsSending(false);
      setError(null);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          zIndex: 1001,
          width: "90%",
          maxWidth: "500px",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#7B7FEE", marginBottom: 5 }}>
          Add money
        </h3>
        {view === "copyAddress" ? (
          <>
            <div style={{ color: "#00000099", fontSize: "14px" }}>
              <p>Copy address and send sepolia ETH to this wallet.</p>
            </div>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                marginTop: "15px",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "10px",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{ wordBreak: "break-all", flex: 1, fontSize: "14px" }}
              >
                {wallet.address}
              </div>
              <button
                onClick={copyAddress}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "6px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#7B7FEE")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#666")}
              >
                <IconCopy size={16} />
              </button>
            </div>
          </>
        ) : (
          <>
            <select
              value={selectedWallet?.value || ""}
              onChange={(e) =>
                setSelectedWallet(
                  walletOptions.find((w) => w.value === e.target.value) || null
                )
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                backgroundColor: "#f5f5f5",
                fontSize: "14px",
                marginTop: "5px",
                color: "#666",
              }}
            >
              <option value="">Select a wallet</option>
              {walletOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        )}
        {hasMoreThanOneWallet && view === "copyAddress" ? (
          <div
            style={{
              display: "flex",
              justifyContent: hasMoreThanOneWallet
                ? "space-between"
                : "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => setView("selectWallet")}
              style={{
                backgroundColor: "#7B7FEE",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Fund with another wallet
            </button>

            <button
              onClick={onClose}
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
        ) : view === "selectWallet" ? (
          <>
            <div style={{ color: "#999", fontSize: "12px" }}>
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginBottom: "1rem",
                  marginTop: "10px",
                }}
              >
                <input
                  placeholder="Enter ETH amount"
                  value={!selectedWallet ? "" : amount}
                  disabled={!selectedWallet}
                  style={{
                    padding: "8px 12px",
                    paddingRight: "125px",
                    fontSize: "14px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    outline: "none",
                    color: !selectedWallet ? "#999" : "black",
                    backgroundColor: "#f5f5f5",
                  }}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {/* <span
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                    pointerEvents: "none",
                  }}
                >
                  {`${
                    selectedWallet
                      ? formatBalanceEth(selectedWallet.balance || 0)
                      : 0
                  } available`}
                </span> */}
              </div>
            </div>
            {error && (
              <div
                style={{ color: "red", marginBottom: "10px", fontSize: "12px" }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <button
                onClick={() => {
                  setView("copyAddress");
                  setError(null);
                }}
                style={{
                  backgroundColor: "#999",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: 10,
                }}
              >
                Back
              </button>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={sendFunds}
                  style={{
                    backgroundColor: "#7B7FEE",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  disabled={!selectedWallet}
                >
                  Send funds
                </button>
                <button
                  onClick={onClose}
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
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AddMoneyModal;
