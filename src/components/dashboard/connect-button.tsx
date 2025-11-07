import { useState } from "react";
import { useEthers } from "@/hooks/useEthers";
import { connectArcId } from "@/lib/api";
import { useAccount } from "wagmi";

export function ConnectWithArcID() {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { signer } = useEthers();

  const handleConnect = async () => {
    try {
      setLoading(true);
      const walletSigner = await signer;

      const message = `Sign in to ArcID with ArcID at ${new Date().toISOString()}`;
      const signature = await walletSigner?.signMessage(message);

      const data = await connectArcId(
        address as string,
        signature || "",
        message
      );
      if (data.success) {
        alert("ArcID connected successfully");
      } else {
        alert("Connection failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting ArcID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="cursor-pointer"
    >
      {loading ? "Connecting..." : "Connect with ArcID"}
    </button>
  );
}
