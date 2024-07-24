import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}
import { useNavigate } from "react-router-dom";

const walletconnect = async () => {
  const navigate = useNavigate();
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const address = (await signer).getAddress();
      console.log("Connected account:", address);
      navigate("/TransactionPage");
      // return signer;
      // Redirect or perform actions after successful login
    } catch (error) {
      console.error("Error connecting Metamask:", error);
    }
  } else {
    console.error("Metamask not detected");
    // Inform the user to install Metamask or use an Ethereum-compatible browser
    alert(
      "Metamask not detected. Please install Metamask or use an Ethereum-compatible browser."
    );
  }
};
export default walletconnect;
