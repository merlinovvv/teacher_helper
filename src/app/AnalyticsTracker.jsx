import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

ReactGA.initialize(import.meta.env.VITE_GOOGLE_AN); // Ваш идентификатор отслеживания

// Отправка события при изменении маршрута
const trackPageView = (path) => {
    ReactGA.send({ hitType: "pageview", page: path });
};

export default function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname);
    }, [location]);

    return null;
};
