import '../../Style/NotesWidget.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase'
import { useSettingContext } from '../SettingContext.js';

const NotesWidget = () => {
  const { mobileOptimizedMode } = useSettingContext();
  const [nextArrow, setNextArrow] = useState("flex");
  const [prevArrow, setPrevArrow] = useState("none");
  const [startIndex, setStartIndex] = useState(0);
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageSize = 3;

  // Fetch data on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Notes')
          .select('*');
        
        if (error) {
          console.error("خطا در دریافت نوت‌ها:", error.message);
          setError(error.message);
        } else {
          console.log("نوت‌های دریافت‌شده:", data);
          setNotesData(data || []);
        }
      } catch (err) {
        console.error("خطا در دریافت داده‌ها:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleNext = () => {
    setStartIndex(startIndex + pageSize);
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - pageSize, 0));
  };

  const notNext = () => {
    setStartIndex(startIndex + 0);
    setNextArrow(hasMore ? "flex" : "none");
    setPrevArrow(hasPrev ? "flex" : "none");
  };

  const notPrev = () => {
    setStartIndex(startIndex + 0);
    setNextArrow(hasMore ? "flex" : "none");
    setPrevArrow(hasPrev ? "flex" : "none");
  };

  const currentNotes = notesData.slice(startIndex, startIndex + pageSize);
  const hasMore = startIndex + pageSize < notesData.length;
  const hasPrev = startIndex > 0;

  // Update arrows when data changes
  useEffect(() => {
    setNextArrow(hasMore ? "flex" : "none");
    setPrevArrow(hasPrev ? "flex" : "none");
  }, [hasMore, hasPrev]);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="notes">
      {[...Array(pageSize)].map((_, index) => (
        <div 
          key={index} 
          className="note skeleton" 
          style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}
        >
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line shorter"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{height: '100%'}}>
      <div style={{height: '40px', zIndex: '1'}}>    
        <div className='titleDiv'>
          <p className='title'>یاداشت ها</p>
          {!loading && (
            <>
              <div onClick={hasMore ? handleNext : notNext} style={{display: nextArrow}} className="editButton" title='بعدی'>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9639 6.21631C13.1865 5.51361 14.1842 5.5123 14.8438 5.89307C15.503 6.27366 15.9999 7.13782 16 8.55225V13.4478C16 14.8622 15.503 15.7263 14.8438 16.1069C14.1841 16.4878 13.1867 16.4857 11.9639 15.7827H11.9648L10.792 15.105C10.6625 15.0296 10.583 14.8918 10.583 14.7397V7.26025C10.583 7.14607 10.6279 7.04001 10.7051 6.9624L10.792 6.89502L11.9648 6.21729L11.9639 6.21631Z" fill="white" stroke="white"/>
                  <path d="M8.66699 13.8765L7.72266 13.3267L7.7207 13.3257L7.5 13.1919C6.43817 12.5156 5.99805 11.7133 5.99805 10.9995C5.99823 10.2383 6.4991 9.37663 7.7207 8.67432L7.72266 8.67334L8.66699 8.12256V13.8765Z" fill="white" stroke="white"/>
                </svg>
              </div>
              <div onClick={hasPrev ? handlePrev : notPrev} style={{display: prevArrow}} className="editButton" title='قبلی'>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.15625 5.89307C7.81575 5.51248 8.81293 5.51397 10.0352 6.21631V6.21729L11.207 6.89404V6.89502C11.3367 6.97034 11.417 7.10804 11.417 7.26025V14.7397C11.417 14.892 11.3367 15.0297 11.207 15.105L10.0352 15.7827C8.81267 16.4854 7.81584 16.4876 7.15625 16.1069C6.49695 15.7263 6.00004 14.8623 6 13.4478V8.55225C6.00008 7.1378 6.49698 6.27365 7.15625 5.89307Z" fill="white" stroke="white"/>
                  <path d="M13.5137 14.3345L13.2695 13.9155H13.2705L13.5137 14.3345ZM14.2773 8.67334L14.2793 8.67432C15.5009 9.37663 16.0018 10.2383 16.002 10.9995C16.002 11.7608 15.5011 12.6232 14.2793 13.3257L14.2773 13.3267L13.333 13.8765V8.12256L14.2773 8.67334Z" fill="white" stroke="white"/>
                </svg>
              </div>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : error ? (
  <div style={{height: '100%'}}>
    <div className="notes">
      {[...Array(pageSize)].map((_, index) => (
        <div 
          key={index} 
          className="note skeleton" 
          style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}
        >
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line shorter"></div>
        </div>
      ))}
    </div>
        <div className="error-container">
          <div className="error-message">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="#ff6b6b"/>
            </svg>
            خطا در دریافت اطلاعات یادداشت‌ها
          </div>
        </div>
      </div>
      ) : (
        <div className="notes">
          {currentNotes.map((item, index) => (
            <div key={item.id || index} className="note" style={{ background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99" }}>        
              <p key={index}>{item.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesWidget;