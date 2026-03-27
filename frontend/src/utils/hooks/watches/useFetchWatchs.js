import { useEffect, useState } from "react";
import { axiosPublic } from "../../../axios-client";

function useFetchWatches({ type = null, brand = null, key = null, limit = 8, page = 1 }) {
    const [watches, setWatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notWatchesFound, setNotWatchesFound] = useState(false);
    const [total, setTotal] = useState(0);
    useEffect(() => {

        // Case 1 key is null means we don't want to search but still want to fetch watches
        // Case 2 key not empty string means we want to search by key
        // Case 3 brand is not null means we want to filter by brand
        // Case 4 type is not null means we want to filter by type(gender)
        if (key === null || key !== "" || brand !== null || type !== null) {
            setLoading(true);
            setError(null);
            const fetchWatches = async () => {
                try {
                    const { data } = await axiosPublic.get("api/client/watches", {
                        params: {
                            type: type,
                            limit: limit,
                            page: page,
                            key: key,
                            brand: brand,
                        },
                    });
                    setWatches(data.data);
                    setTotal(data.meta.total);

                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchWatches();
            if (!watches.length) {
                setNotWatchesFound(true);
            }
        }
        // If key is empty string, we don't want to fetch watches
        else {
            setWatches([]);
            setLoading(false);
            setNotWatchesFound(false);
        }
        // Cleanup function to reset states
        return () => {
            setWatches([]);
            setLoading(true);
            setError(null);
            setNotWatchesFound(false);
        }
    }, [type, page, key, brand]);

    return { total, watches, setWatches, loading, setLoading, error, notWatchesFound };
}

export default useFetchWatches;
