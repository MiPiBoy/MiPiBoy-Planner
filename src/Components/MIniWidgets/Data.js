import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';

const Data = () => {

    const [dateInfo, setDateInfo] = useState({});

  useEffect(() => {
    const now = new Date();

    // تاریخ میلادی
    const gregorianDay = now.getDate();
    const gregorianMonth = now.toLocaleString('en-US', { month: 'long' });
    const gregorianWeekday = now.toLocaleString('en-US', { weekday: 'long' });
    const gregorianFull = `${now.getFullYear()} / ${now.getMonth() + 1} / ${gregorianDay}`;

    // تبدیل به شمسی
    const { jy, jm, jd } = jalaali.toJalaali(now);
    const persianWeekday = now.toLocaleString('fa-IR', { weekday: 'long' });
    const persianMonth = now.toLocaleString('fa-IR', { month: 'long' });
    const persianFull = `${jy} / ${jm} / ${jd}`;

    setDateInfo({
      gregorianWeekday,
      gregorianMonth,
      gregorianDay,
      gregorianFull,
      persianWeekday,
      persianMonth,
      persianDay: jd,
      persianFull,
    });
  }, []);

    return (
    <div className="dateDisplay">
        <div className='dateSection'>
            <p>{dateInfo.persianWeekday} {dateInfo.persianDay} {dateInfo.persianMonth}</p>
            <p>{dateInfo.persianFull}</p>
        </div>
        <div className='dateSection'>
            <p>{dateInfo.gregorianWeekday} {dateInfo.gregorianDay} {dateInfo.gregorianMonth}</p>
            <p>{dateInfo.gregorianFull}</p>
        </div>
    </div>
  );
}

export default Data;
