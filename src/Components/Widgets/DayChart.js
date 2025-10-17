const DayChart = () => {

  return (
    <div style={{gap: "24px",display: "flex",flexDirection: "column"}}>
        <div className='titleDiv'>
            <p className='title'>وظایف روز</p>
            <p className='subtitle'>دید کلی از نمودار وظایف امروزت، فقط انجامش بده.</p>
        </div>
    
        <button className='Gray Medium Pill ButtonMipiboy' style={{width: "100%", boxSizing: "border-box"}} >
            <span>ویرایش</span>    
        </button>
    
    </div>
);
}

export default DayChart;