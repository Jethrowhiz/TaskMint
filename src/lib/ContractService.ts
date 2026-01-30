import { STACKS_TESTNET } from "@stacks/network";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "./stacks-api";
import { openContractCall } from "@stacks/connect";
import { toast } from "../components/ui/use-toast";
import { toDecimal, truncateValue } from "./helper-functions";
import { fetchCallReadOnlyFunction, PostConditionMode, Cl, cvToJSON } from '@stacks/transactions'

export class ContractService {

  constructor() {
    if (typeof window === "undefined") return;
  }

  async getBountyCount(): Promise<number> {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "get-bounty-count",
        functionArgs: [],
        network: STACKS_TESTNET,
        senderAddress: CONTRACT_ADDRESS,
      });
      const jsonResult = cvToJSON(result).value;
      return parseInt(jsonResult);
    } catch (error) {
      console.error("Error fetching bounty count:", error);
      throw error;
    }
  }

  async getAllBounties(): Promise<any[]> {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "get-all-bounties",
        functionArgs: [Cl.uint(0)],
        network: STACKS_TESTNET,
        senderAddress: CONTRACT_ADDRESS,
      });

      const bounties = cvToJSON(result).value
        ?.filter((b: any) => b.value !== null)
        .map((b: any, index: number) => ({
          id: index,
          client: b.value?.value?.client?.value,
          description: b.value?.value?.description?.value,
          reward: truncateValue(toDecimal(b.value?.value?.reward?.value)),
          status: Number(b.value?.value?.status?.value),
          submissionLink: b.value?.value["submission-link"]?.value,
          worker: b.value?.value?.worker?.value?.value ? b.value?.value?.worker?.value?.value : null,
        }))
        .reverse();
      
      console.log("Fetched bounties:", bounties);
      return bounties;
    } catch (error) {
      console.error("Error fetching all bounties:", error);
      throw error;
    }
  }

  async getBounty(id: number): Promise<any> {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "bounties",
        functionArgs: [Cl.uint(id)],
        network: STACKS_TESTNET,
        senderAddress: CONTRACT_ADDRESS,
      });
      const bounty = cvToJSON(result).value;
      return bounty;
    } catch (error) {
      console.error(`Error fetching bounty ${id}:`, error);
      throw error;
    }
  }
  
  createBounty (description: string, rewardInMnt: string, address: string): Promise<any> {
    if (!address) {
      toast({
        variant: "error",
        description: "Wallet not connected.",
      });
      return Promise.reject(new Error("Wallet not connected"));
    }
    
    const rewardInMicrostx = Math.floor(parseFloat(rewardInMnt) * 1_000_000);

    try {
      return new Promise<any>(async (resolve, reject) => {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "create-bounty",
          functionArgs: [
            Cl.stringUtf8(description),
            Cl.uint(rewardInMicrostx),
          ],
          network: STACKS_TESTNET,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log("Transaction submitted:", data.txId);
            toast({
              variant: "success",
              description: "Bounty created successfully.",
              action: { label: "View on Explorer", url: `https://explorer.hiro.so/txid/${data.txId}?chain=testnet` }
            });
            resolve(data);
          },
          onCancel: () => {
            console.log("Transaction cancelled by user");
            reject(new Error("Transaction cancelled by user"));
          },
        });
      });
    } catch (error) {
      console.error("Error creating bounty:", error);
      throw error;
    }
  };

  cancelBounty(bountyId: number, address: string): Promise<any> {
    if (!address) {
      toast({
        variant: "error",
        description: "Wallet not connected.",
      });
      return Promise.reject(new Error("Wallet not connected"));
    }

    try {
      return new Promise<any>(async (resolve, reject) => {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "cancel-bounty",
          functionArgs: [
            Cl.uint(bountyId),
          ],
          network: STACKS_TESTNET,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log("Transaction cancelled:", data.txId);
            toast({
              variant: "success",
              description: "Bounty cancelled successfully.",
              action: { label: "View on Explorer", url: `https://explorer.hiro.so/txid/${data.txId}?chain=testnet` }
            });
            resolve(data);
          },
          onCancel: () => {
            toast({
              variant: "error",
              description: "User rejected request.",
            });
            reject(new Error("User rejected request."));
          },
        });
      });
    } catch (error) {
      console.error(`Error cancelling bounty ${bountyId}:`, error);
      throw error;
    }
  }

  submitWork(bountyId: number, submissionLink: string, address: string): Promise<any> {
    if (!address) {
      toast({
        variant: "error",
        description: "Wallet not connected.",
      });
      return Promise.reject(new Error("Wallet not connected"));
    }

    try {
      return new Promise<any>(async (resolve, reject) => {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "submit-work",
          functionArgs: [
            Cl.uint(bountyId),
            Cl.stringUtf8(submissionLink),
          ],
          network: STACKS_TESTNET,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log("Work submitted:", data.txId);
            toast({
              variant: "success",
              description: "Bounty work submitted successfully.",
              action: { label: "View on Explorer", url: `https://explorer.hiro.so/txid/${data.txId}?chain=testnet` }
            });
            resolve(data);
          },
          onCancel: () => {
            toast({
              variant: "error",
              description: "User rejected request.",
            });
            reject(new Error("Submission cancelled by user"));
          },
        });
      });
    } catch (error) {
      console.error(`Error submitting work for bounty ${bountyId}:`, error);
      throw error;
    }
  };

  approveWork(bountyId: number, address: string): Promise<any> {
    if (!address) {
      toast({
        variant: "error",
        description: "Wallet not connected.",
      });
      return Promise.reject(new Error("Wallet not connected"));
    }

    try {
      return new Promise<any>(async (resolve, reject) => {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "approve-bounty",
          functionArgs: [
            Cl.uint(bountyId),
          ],
          network: STACKS_TESTNET,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log("Transaction approved:", data.txId);
            toast({
              variant: "success",
              description: "Bounty work approved successfully.",
              action: { label: "View on Explorer", url: `https://explorer.hiro.so/txid/${data.txId}?chain=testnet` }
            });
            resolve(data);
          },
          onCancel: () => {
            toast({
              variant: "error",
              description: "Approval cancelled by user.",
            });
            reject(new Error("Approval cancelled by user"));
          },
        });
      });
    } catch (error) {
      console.error(`Error approving work for bounty ${bountyId}:`, error);
      throw error;
    }
  };
}

export const contractService = new ContractService();