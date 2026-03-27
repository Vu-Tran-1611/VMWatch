import { useEffect, useState } from "react";
import { axiosPublic } from "../../../axios-client";

function useFetchBrands({ type = null } = {}) {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchBrands = async () => {
            try {
                const { data } = await axiosPublic.get("api/client/brands", {
                    params: {
                        type: type,
                    },
                });
                setBrands(data.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, [type]);

    return { brands, loading, error };
}

export default useFetchBrands;
