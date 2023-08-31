import { useEffect, useState } from "react"

export default (idleTime = 10000) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, idleTime);

        return () => clearInterval(interval);
    }, []);
}