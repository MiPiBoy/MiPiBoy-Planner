import { useEffect, useState } from 'react';

const TehranTime = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const Seconds = String(now.getSeconds()).padStart(2, '0');
        setTime(`${hours}:${minutes}:${Seconds}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="digital-clock">
        {time}
        </div>
        );
}

export default TehranTime;