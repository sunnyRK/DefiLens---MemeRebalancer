import { useEffect, useCallback } from "react";
import axios from "axios";
import { decreasePowerByDecimals } from "../helper";

export type TransactionStatus = "pending" | "completed" | "notStarted";

// Define the structure of the API response
interface TokenBalanceResponse {
    balance: string;
    decimals: number;
}

// Types for the hook parameters
interface FetchTokenBalanceParams {
    smartAccountAddress: string;
    tokenAddress: string;
    chainId: string | number;
    decreasePowerByDecimals: (balance: string, decimals: number) => string;
}

const useFetchTokenBalance = ({
    smartAccountAddress,
    tokenAddress,
    chainId,
}: FetchTokenBalanceParams) => {
    // Function to fetch the balance
    const fetchTokenBalance = useCallback(async () => {
        try {
            const response = await axios.get<TokenBalanceResponse>(
                `/token/getBalance?userAddress=${smartAccountAddress}`
            );

            return response;
        } catch (error) {
            console.error("Error fetching token balances:", error);
            throw new Error("Failed to fetch token balance");
        }
    }, [smartAccountAddress, tokenAddress, chainId]);

    return { fetchTokenBalance };
};

export default useFetchTokenBalance;
