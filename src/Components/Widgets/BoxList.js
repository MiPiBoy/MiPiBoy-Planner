import "../../Style/BoxList.css"
import "../../Style/Task.css"
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../utils/supabase'
import jalaali from 'jalaali-js';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSettingContext } from '../SettingContext.js';
import { useTaskContext } from "../TaskContext.js";

const BoxList = () => {
  const [boxsData, setBoxsData] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mobileOptimizedMode } = useSettingContext();
  const { reloadFlag3 } = useTaskContext();

  // ایجاد refهای داینامیک برای هر آیتم
  const targetRefs = useRef([]);
  const moveRefs = useRef([]);

  // تابع برای تنظیم موقعیت budgeting
  useEffect(() => {
    if (activeIndex !== null) {
      const targetEl = targetRefs.current[activeIndex];
      const moveEl = moveRefs.current[activeIndex];

      if (targetEl && moveEl) {
        const targetHeight = targetEl.offsetHeight;
        moveEl.style.translate = `0 -${targetHeight / 2}px`;
      }
    }
  }, [activeIndex]);

  // دریافت داده از دیتابیس
  useEffect(() => {
    fetchBoxsData();
  }, [reloadFlag3]);

  const fetchBoxsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('BuckBoxs')
        .select('*');

      if (error) {
        console.error("خطا در دریافت باکس ها:", error.message);
        setError("خطا در دریافت اطلاعات باکس‌ها");
      } else {
        setBoxsData(data || []);
        console.log("باکس ها دریافت‌شدند");
      }
    } catch (error) {
      console.error("خطا در دریافت داده باکس‌ها:", error);
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  // تابع برای تغییر مقدار input
  const handleInputChange = (index, value) => {
    setInputValues(prev => ({
      ...prev,
      [index]: value
    }));
  };

  // تابع برای افزایش مقدار
  const handleIncrease = async (item, index) => {
    const inputValue = parseFloat(inputValues[index]) || 0;
    if (inputValue <= 0) return;

    const newValue = item.value + inputValue;

    // اول UI رو به‌روز کن
    setBoxsData(prev => prev.map(box =>
      box.code === item.code ? { ...box, value: newValue } : box
    ));

    setInputValues(prev => ({ ...prev, [index]: '' }));

    // بعد دیتابیس رو به‌روز کن
    try {
      await supabase
        .from('BuckBoxs')
        .update({ value: newValue })
        .eq('code', item.code);
    } catch (error) {
      console.error("خطا در به‌روزرسانی مقدار:", error);
      // Rollback UI changes in case of error
      setBoxsData(prev => prev.map(box =>
        box.code === item.code ? { ...box, value: item.value } : box
      ));
    }
  };

  // تابع برای کاهش مقدار
  const handleDecrease = async (item, index) => {
    const inputValue = parseFloat(inputValues[index]) || 0;
    if (inputValue <= 0) return;

    const newValue = Math.max(0, item.value - inputValue);

    // اول UI رو به‌روز کن
    setBoxsData(prev => prev.map(box =>
      box.code === item.code ? { ...box, value: newValue } : box
    ));

    setInputValues(prev => ({ ...prev, [index]: '' }));

    // بعد دیتابیس رو به‌روز کن
    try {
      await supabase
        .from('BuckBoxs')
        .update({ value: newValue })
        .eq('code', item.code);
    } catch (error) {
      console.error("خطا در به‌روزرسانی مقدار:", error);
      // Rollback UI changes in case of error
      setBoxsData(prev => prev.map(box =>
        box.code === item.code ? { ...box, value: item.value } : box
      ));
    }
  };

  const schema = yup.object().shape({
    requiredValue: yup.number().typeError("مقدار عددی وارد کنید")
  });

  const { register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // تابع برای تبدیل تاریخ دیتابیس به فرمت قابل نمایش
  const formatPersianDate = (databaseDate) => {
    if (!databaseDate) return '';

    const parts = databaseDate.split('/');
    if (parts.length !== 3) return databaseDate;

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    // تبدیل به تاریخ میلادی
    const gregorianDate = jalaali.toGregorian(year, month, day);
    const dateObj = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd);

    // گرفتن اطلاعات تاریخ شمسی
    const persianWeekday = dateObj.toLocaleString('fa-IR', { weekday: 'long' });
    const persianMonth = dateObj.toLocaleString('fa-IR', { month: 'long' });

    return {
      persianWeekday,
      persianMonth,
      persianDay: day,
      fullDate: `${persianWeekday} ${day} ${persianMonth}`
    };
  };

  // تابع برای محاسبه روزهای مانده
  const calculateDaysRemaining = (targetDateString) => {
    if (!targetDateString) return 0;

    const parts = targetDateString.split('/');
    if (parts.length !== 3) return 0;

    const targetDay = parseInt(parts[0]);
    const targetMonth = parseInt(parts[1]);
    const targetYear = parseInt(parts[2]);

    // تاریخ هدف
    const targetGregorian = jalaali.toGregorian(targetYear, targetMonth, targetDay);
    const targetDate = new Date(targetGregorian.gy, targetGregorian.gm - 1, targetGregorian.gd);

    // تاریخ امروز
    const today = new Date();

    // محاسبه تفاوت
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div style={{ paddingTop: '14px' }}>
      <div>
        <div style={{ mask: 'linear-gradient(black, #0000003d, transparent)' }}><div style={{ height: "30px" }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="box-card skeleton" style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}>
              <div className="box-title skeleton-line"></div>
              <div className="box-section">
                <div className="box-column">
                  <div className="progress-container">
                    <div className="progress-label skeleton-line shorter"></div>
                    <div className="progress-fill skeleton-line"></div>
                  </div>
                  <div className="progress-text skeleton-line shorter"></div>
                </div>
              </div>
              <div className="box-row">
                <div className="box-days skeleton-line short"></div>
                <div className="box-date skeleton-line shorter"></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="box-card skeleton" style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}>
              <div className="box-title skeleton-line"></div>
              <div className="box-section">
                <div className="box-column">
                  <div className="progress-container">
                    <div className="progress-label skeleton-line shorter"></div>
                    <div className="progress-fill skeleton-line"></div>
                  </div>
                  <div className="progress-text skeleton-line shorter"></div>
                </div>
              </div>
              <div className="box-row">
                <div className="box-days skeleton-line short"></div>
                <div className="box-date skeleton-line shorter"></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="box-card skeleton" style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}>
              <div className="box-title skeleton-line"></div>
              <div className="box-section">
                <div className="box-column">
                  <div className="progress-container">
                    <div className="progress-label skeleton-line shorter"></div>
                    <div className="progress-fill skeleton-line"></div>
                  </div>
                  <div className="progress-text skeleton-line shorter"></div>
                </div>
              </div>
              <div className="box-row">
                <div className="box-days skeleton-line short"></div>
                <div className="box-date skeleton-line shorter"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error Component
  const ErrorMessage = () => (
    <div style={{ paddingTop: '14px' }}>
      <div style={{ mask: 'linear-gradient(black, #0000003d, transparent)' }}>
        <div><div style={{ height: "30px" }} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div className="box-card skeleton" style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}>
            <div className="box-title skeleton-line"></div>
            <div className="box-section">
              <div className="box-column">
                <div className="progress-container">
                  <div className="progress-label skeleton-line shorter"></div>

                  <div className="progress-fill skeleton-line"></div>

                </div>
                <div className="progress-text skeleton-line shorter"></div>
              </div>
            </div>
            <div className="box-row">
              <div className="box-days skeleton-line short"></div>
              <div className="box-date skeleton-line shorter"></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div className="box-card skeleton" style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}>
            <div className="box-title skeleton-line"></div>
            <div className="box-section">
              <div className="box-column">
                <div className="progress-container">
                  <div className="progress-label skeleton-line shorter"></div>

                  <div className="progress-fill skeleton-line"></div>

                </div>
                <div className="progress-text skeleton-line shorter"></div>
              </div>
            </div>
            <div className="box-row">
              <div className="box-days skeleton-line short"></div>
              <div className="box-date skeleton-line shorter"></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div className="box-card skeleton" style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}>
            <div className="box-title skeleton-line"></div>
            <div className="box-section">
              <div className="box-column">
                <div className="progress-container">
                  <div className="progress-label skeleton-line shorter"></div>

                  <div className="progress-fill skeleton-line"></div>

                </div>
                <div className="progress-text skeleton-line shorter"></div>
              </div>
            </div>
            <div className="box-row">
              <div className="box-days skeleton-line short"></div>
              <div className="box-date skeleton-line shorter"></div>
            </div>
          </div>
        </div>

      </div>
      <div className="error-container">
        <div className="error-message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="#ff6b6b" />
          </svg>
          {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkList">
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <ErrorMessage />
      ) : (
        <>
          <div><div style={{ height: "30px" }} /></div>
          {boxsData.map((item, index) => {
            const percent = item.requiredValue !== 0 ? (item.value / item.requiredValue) * 100 : 0;
            const daysRemaining = calculateDaysRemaining(item.date);
            const formattedDate = formatPersianDate(item.date);
            const currentInputValue = inputValues[index] || '';

            return (
              <div key={item.code} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div ref={el => targetRefs.current[index] = el} className={`box-card ${activeIndex === index ? "blurred" : ""}`}
                  onClick={() => { setActiveIndex(activeIndex === null ? index : null) }} style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}
                >
                  <div className="box-title">
                    {item.name}
                    <div title="ویرایش موجودی باکس" style={{ width: '22px', height: '22px', cursor: 'pointer' }}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11 16.5V5.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" /> <path d="M14.667 11H16.5003" stroke="white" strokeLinecap="round" strokeLinejoin="round" /> <path d="M5.5 11H10.6883" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path d="M11 16.5V5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>
                    </div>
                  </div>
                  <div className="box-section">
                    {item.requiredValue !== 0 ?
                      <div className="box-column">
                        <div className="progress-container">
                          <div className="progress-label">
                            {Math.min(percent, 100).toFixed(0)}%
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${percent}%` }}>
                            </div>
                          </div>
                        </div>
                        <div className="progress-text">
                          {item.value.toLocaleString()} / {item.requiredValue.toLocaleString()}
                        </div>
                      </div>
                      :
                      <div className="box-row">
                        <div className="box-price">{item.value.toLocaleString()}</div>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.75 14.52H12.98C13.31 14.52 13.59 14.22 13.59 13.85C13.59 13.38 13.48 13.32 13.16 13.21L12.75 13.07V14.52Z" fill="white" />
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.57999 16.42C7.86999 16.71 7.86999 17.19 7.57999 17.48C7.42999 17.63 7.23999 17.7 7.04999 17.7C6.85999 17.7 6.66999 17.63 6.51999 17.48C5.05999 16.02 4.25 14.07 4.25 12C4.25 9.93 5.05999 7.98 6.51999 6.52C6.80999 6.23 7.28999 6.23 7.57999 6.52C7.86999 6.81 7.86999 7.29 7.57999 7.58C6.39999 8.76 5.75 10.33 5.75 12C5.75 13.67 6.39999 15.24 7.57999 16.42ZM13.65 11.78C14.61 12.12 15.08 12.79 15.08 13.84C15.08 15.04 14.14 16.01 12.97 16.01H12.74V16.19C12.74 16.6 12.4 16.94 11.99 16.94C11.58 16.94 11.24 16.6 11.24 16.19V16.01H11.21C9.93999 16.01 8.89999 14.94 8.89999 13.63C8.89999 13.22 9.23999 12.88 9.64999 12.88C10.06 12.88 10.4 13.22 10.4 13.63C10.4 14.12 10.76 14.51 11.21 14.51H11.24V12.53L10.34 12.21C9.38 11.87 8.91 11.2 8.91 10.15C8.91 8.95 9.84999 7.98 11.02 7.98H11.25V7.8C11.25 7.39 11.59 7.05 12 7.05C12.41 7.05 12.75 7.39 12.75 7.8V7.98H12.78C14.05 7.98 15.09 9.05 15.09 10.36C15.09 10.77 14.75 11.11 14.34 11.11C13.93 11.11 13.59 10.77 13.59 10.36C13.59 9.87 13.23 9.48 12.78 9.48H12.75V11.46L13.65 11.78ZM17.48 17.48C17.33 17.63 17.14 17.7 16.95 17.7C16.76 17.7 16.57 17.63 16.42 17.48C16.13 17.19 16.13 16.71 16.42 16.42C17.6 15.24 18.25 13.67 18.25 12C18.25 10.33 17.6 8.76 16.42 7.58C16.13 7.29 16.13 6.81 16.42 6.52C16.71 6.23 17.19 6.23 17.48 6.52C18.94 7.98 19.75 9.93 19.75 12C19.75 14.07 18.94 16.02 17.48 17.48Z" fill="white" />
                          <path d="M10.4199 10.16C10.4199 10.63 10.5299 10.69 10.8499 10.8L11.2599 10.94V9.47998H11.0299C10.6899 9.47998 10.4199 9.78998 10.4199 10.16Z" fill="white" />
                        </svg>
                      </div>
                    }
                  </div>
                  {item.date !== '' ?
                    <div className="box-row">
                      <div className="box-days">{daysRemaining} روز</div>
                      <div className="box-date">
                        {formattedDate.fullDate}
                      </div>
                    </div>
                    : null}
                  {item.description !== '' ?
                    <div className="box-description">
                      {item.description}
                    </div>
                    : null}
                </div>
                <div ref={el => moveRefs.current[index] = el} className="budgeting" style={{ zIndex: '1', display: activeIndex === index ? 'flex' : 'none' }} >
                  <div className="budgetingSection">
                    <div className="inBorder" onClick={() => handleDecrease(item, index)}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 11H16.5" stroke="#121212" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="budgetInput">
                    <div className="inBorder">
                      <input
                        style={{ width: 'calc(100% - 8px)', border: 0, padding: 0 }}
                        className="formInput"
                        type="text"
                        placeholder="مقدار"
                        value={currentInputValue}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="budgetingSection">
                    <div className="inBorder" onClick={() => handleIncrease(item, index)}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 11H16.5" stroke="#121212" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11 16.5V5.5" stroke="#121212" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default BoxList;