import React, { useEffect } from "react";
import {
  BitcoinNetwork,
  BitcoinWallet,
  BitcoinProvider,
  EVMWallet,
  //   BitcoinOTA,
} from "@catalogfi/wallets";
import {
  JsonRpcProvider,
  //  BrowserProvider,
  Wallet,
} from "ethers";
import {
  Chains,
  Orderbook,
  Actions,
  parseStatus,
  Assets,
} from "@gardenfi/orderbook";
import { GardenJS } from "@gardenfi/core";

const Swap: React.FC = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Bitcoin Provider
        const bitcoinProvider = new BitcoinProvider(BitcoinNetwork.Mainnet);
        const bitcoinPk = process.env.BITCOIN_KEY!;
        // "1c8cec02a8b8e962cac7e94a48e1530ae2fc809c791586369dd272f99ba6cf66";
        const bitcoinWallet = BitcoinWallet.fromPrivateKey(
          bitcoinPk,
          bitcoinProvider
        );

        // Initialize Ethereum Provider and Signer
        // const browserProvider = new BrowserProvider(window.ethereum);
        // const signer = await browserProvider.getSigner();

        // const signer = await new BrowserProvider(window.ethereum).getSigner();

        // const provider = new BitcoinProvider(BitcoinNetwork.Mainnet);
        const ethereumProvider = new JsonRpcProvider(
          "https://rpc.ankr.com/eth"
        );

        const wallet = new Wallet(bitcoinPk, ethereumProvider);
        const evmWallet = new EVMWallet(wallet);
        console.log(evmWallet);

        // Initialize Orderbook
        const orderbook = await Orderbook.init({
          url: "https://orderbook-testnet.garden.finance/",
          signer: wallet,
          opts: {
            domain: window.location.host,
            store: localStorage,
          },
        });

        // Initialize GardenJS
        const wallets = {
          [Chains.bitcoin]: bitcoinWallet,
          [Chains.ethereum]: evmWallet,
        };
        const garden = new GardenJS(orderbook, wallets);

        // Define amounts for swap
        const sendAmount = 0.0001 * 1e8;
        const receiveAmount = (1 - 0.3 / 100) * sendAmount;

        // Create swap order
        const orderId = await garden.swap(
          Assets.bitcoin.BTC,
          Assets.ethereum.WBTC,
          sendAmount,
          receiveAmount
        );

        // Subscribe to orders
        garden.subscribeOrders(await evmWallet.getAddress(), async (orders) => {
          // Filter the order we have just created
          const order = orders.filter((order) => order.ID === orderId)[0];
          if (!order) return;

          // Get the action we can perform on the order right now
          const action = parseStatus(order);
          console.log("action Order:", order);
          console.log("action Action:", action);

          if (
            action === Actions.UserCanInitiate ||
            action === Actions.UserCanRedeem
          ) {
            const swapper = garden.getSwap(order);
            // If it is UserCanInitiate, this step will lock the funds in the contract.
            // If it is UserCanRedeem, this step will unlock the funds from the contract.
            const performedAction = await swapper.next();
            console.log("Performed Action:", performedAction);
            console.log(
              `Completed Action ${performedAction.action} with transaction hash: ${performedAction.output}`
            );
          }
        });
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    initialize();
  }, []);

  return <div className="font-mono text-white">This is Swap component</div>;
};

export default Swap;
