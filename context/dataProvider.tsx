import React, { createContext, useCallback, useEffect } from "react";
import BigNumber from "bignumber.js";
import { ICoinDetails } from "../components/rebalance/types";
import { BASE_URL } from "../utils/keys";
import { memeCoinData } from "../utils/constant";
import { toast } from "react-toastify";
import { useGlobalStore } from "./global.store"; // Zustand store

BigNumber.config({ DECIMAL_PLACES: 10 });

const DataProvider = ({ children }: any) => {
    const { setAllCoins, activeFilter } = useGlobalStore(); // Get the active filter from Zustand

    const fetchCoins = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams({
                [activeFilter]: "desc", // Apply the active filter dynamically
            });
            const response = await fetch(`${BASE_URL}/${queryParams}`);

            setAllCoins(response); // Update Zustand state with merged data
        } catch (error) {
            console.error("Error fetching coin data:", error);
            toast.error("Failed to fetch memecoin list");
        }
    }, [setAllCoins, activeFilter]);

    useEffect(() => {
        fetchCoins();
        const intervalId = setInterval(fetchCoins, 60000); // Fetch every 60 seconds
        return () => clearInterval(intervalId);
    }, [fetchCoins]);

    return <>{children}</>;
};

export default DataProvider;
