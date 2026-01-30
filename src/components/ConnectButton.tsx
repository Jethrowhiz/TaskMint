import { useWallet } from "../context/AppContext";
import { shortenAddress } from "../lib/helper-functions";

const ConnectButton = () => {
  const { isConnected, connectWallet, disconnectWallet, isConnecting, address } = useWallet();
  
  return (
    isConnected && address ? (
      <div className="rounded-xl p-6 shadow-lg bg-gray-100 flex items-center justify-between gap-x-6">
        <div>
          <p className="font-bold mb-1 text-lg text-gray-800">Connected</p>
          <span className="font-mono mb-1 text-gray-500">{shortenAddress(address)}</span>
        </div>

        <button onClick={disconnectWallet} className="btn px-4 py-2 font-medium">Disconnect</button>
      </div>
    ) : (
      <button onClick={connectWallet} className="btn w-48 py-4 text-lg" disabled={isConnecting}>Connect Wallet</button>
    )
  );
};

export default ConnectButton;