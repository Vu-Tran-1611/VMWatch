import { useEffect, useState } from "react";
import { axiosPublic } from "../../../axios-client";

function useFetchBanners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchBanners = async () => {
            try {
                const { data } = await axiosPublic.get("api/client/banners");
                setBanners(data.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    return { banners, loading, error };
}

export default useFetchBanners;
