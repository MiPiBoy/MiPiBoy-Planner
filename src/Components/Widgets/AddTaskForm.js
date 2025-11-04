import "../../Style/SwitchButton.css"
import "../../Style/CheckButton.css"
import "../../Style/Input.css"
import jalaali from 'jalaali-js';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { supabase } from '../../utils/supabase'

const dateRegex = new RegExp(
  `^(` +
    `|` +
    `([1-9]|[12][0-9]|3[01])` + // فقط روز
    `|([1-9]|[12][0-9]|3[01])/([1-9]|1[0-2])` + // روز/ماه
    `|([1-9]|[12][0-9]|3[01])/([1-9]|1[0-2])/([1-9][0-9]{3})` + // روز/ماه/سال
  `)$`
);

const timeRegex = /^$|^([01]?[0-9]|2[0-3])(:[0-5]?[0-9])?$/;

const AddTaskForm = () => {

  const schema = yup.object().shape({
    name : yup.string().required("فیلد نام اجباری است"),
    description : yup.string(),
    data : yup.string().matches(dateRegex, "تاریخ معتبر نیست"),
    taData : yup.string().matches(dateRegex, "تاریخ معتبر نیست"),
    time : yup.string().matches(timeRegex, "زمان معتبر نیست"),
    repeatDays: yup.array().of(yup.string())
  })

  const [dataDisplay, setDataDisplay] = useState("none")
  const [dataDisplay2, setDataDisplay2] = useState("none")
  const [tekrarDisplay, setTekrarDisplay] = useState("none")
  const [timeDisplay, setTimeDisplay] = useState("none")

  const [datalableDisplay, setDataLableDisplay] = useState("flex")
  const [datalableDisplay2, setDataLableDisplay2] = useState("none")
  const [tekrarlableDisplay, setTekrarlableDisplay] = useState("flex")
  const [timeLableDisplay, setTimeLableDisplay] = useState("flex")

  const [toggleState, setToggleState] = useState(false);
  const handleDataToggle = () => {
  if (!toggleState) {
    setDataLableDisplay("none");
    setDataLableDisplay2("flex");
    setDataDisplay("none");
    setDataDisplay2("none");
  } else {
    setDataLableDisplay("flex");
    setDataLableDisplay2("none");
    setDataDisplay("none");
    setDataDisplay2("none");
  }
  setValue("data", "");
  setValue("taData", "");
  setToggleState(!toggleState);
  };

  const { register, handleSubmit, setValue, reset, formState:{errors} } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {repeatDays: ['0', '1', '2', '3', '4', '5', '6']}
  });


  const [dateInfo, setDateInfo] = useState({});

  useEffect(() => {
    const now = new Date();

    const { jy, jm, jd } = jalaali.toJalaali(now);
    const persianNow = `${jy}/${jm}/${jd}`;
    const persianDay = `${jy}/${jm}/${jd}`;
    const persianMonth = `/${jm}/${jy}`;
    const persianYear = `/${jy}`;

    setDateInfo({
      persianNow,
      persianDay,
      persianMonth,
      persianYear,
    });
  }, []);

  const onFormSubmit = async (data) => {

      let finalDate = data.data;

      if (data.data !== '') {
        const parts = data.data.split('/');

        if (parts.length === 1) {
          finalDate = `${data.data}${dateInfo.persianMonth}`;
        } else if (parts.length === 2) {
          finalDate = `${data.data}${dateInfo.persianYear}`;
        }
      }

      let finalTaDate = data.taData;

      if (data.taData !== '') {
        const parts = data.taData.split('/');

        if (parts.length === 1) {
          finalTaDate = `${data.taData}${dateInfo.persianMonth}`;
        } else if (parts.length === 2) {
          finalTaDate = `${data.taData}${dateInfo.persianYear}`;
        }
      }

    let finalTime = data.time;

      if (data.time !== '') {
        const parts = data.time.split(':');

        if (parts.length === 1) {
          finalTime = `${data.time}:00`;
        }
      }

    const payload = {
      ...data,
      time: finalTime,
      data: finalDate,
      taData: finalTaDate
    };

    const { data: insertedData, error } = await supabase
      .from('Tasks')
      .insert([payload]);
    if (error) {
      console.error("خطا در ثبت تسک:", error.message);
    } else {
      console.log(`تسک ${data.name} ثبت شد:`, data);
      alert(`تسک ${data.name} افزوده شد`)
      reset({
        name: "",
        description: "",
        data: "",
        taData: "",
        time: "",
        repeatDays: ['0', '1', '2', '3', '4', '5', '6']
      })
    }
  };
  return (
    <div style={{width: "100%", gap: "12px",display: "flex",flexDirection: "column"}}>
      <div className='titleDiv'>
          <p className='title'>افزودن وظیفه</p>
      </div>
    <form className="forms" onSubmit={handleSubmit(onFormSubmit)}>

      <input className="formInput" type="text" placeholder="نام" {...register("name")} />
      {errors.name && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 10, padding: "8px"}}>{errors.name.message}</p>)}

      <input className="formInput" type="text" placeholder="توضیحات" {...register("description")} />
      {errors.description && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 8}}>{errors.description.message}</p>)}

      <div className="taskType">
        <span style={{fontSize: "14px"}} >وظیفه یکباره</span>
        <label className="switch">
            <input type="checkbox"
              onChange={handleDataToggle  }/>
            <span className="slider"/>
        </label>
      </div>

      <div style={{display: datalableDisplay}} className="formLable">
        <span>تا تاریخ</span>
        <div className="formLable2"
          onClick={() =>{
          setDataDisplay(dataDisplay === "")
          setDataLableDisplay(datalableDisplay === "none" ? "flex" : "none")}}>
          <span>همیشه</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z"/></g></svg>
        </div>
      </div>

      <input style={{display: dataDisplay}} className="formInput" type="text" placeholder="تا تاریخ" {...register("taData")} />
      {errors.taData && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 10, padding: "8px"}}>{errors.taData.message}</p>)}

      <div style={{display: datalableDisplay2}} className="formLable">
        <span>تاریخ</span>
        <div className="formLable2"
          onClick={() =>{
          setDataDisplay2(dataDisplay2 === "")
          setDataLableDisplay2(datalableDisplay2 === "none" ? "flex" : "none")}}>
          <span>همیشه</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z"/></g></svg>
        </div>
      </div>

      <input style={{display: dataDisplay2}} className="formInput" type="text" placeholder="تاریخ" {...register("data")} />
      {errors.data && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 10, padding: "8px"}}>{errors.data.message}</p>)}

      <div style={{display: timeLableDisplay}} className="formLable" >
        <span>زمان</span>
        <div className="formLable2"
          onClick={() =>{
          setTimeDisplay(timeDisplay === "")
          setTimeLableDisplay(timeLableDisplay === "none" ? "flex" : "none")}}>
          <span>کل روز</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z"/></g></svg>
        </div>
      </div>

      <input style={{display: timeDisplay}} className="formInput" type="text" placeholder="ساعت" {...register("time")} />
      {errors.time && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 10, padding: "8px"}}>{errors.time.message}</p>)}
      
      <div style={{display: tekrarlableDisplay}} className="formLable">
        <span>تکرار</span>
        <div className="formLable2"
          onClick={() =>{
          setTekrarDisplay(tekrarDisplay === "")
          setTekrarlableDisplay(tekrarlableDisplay === "none" ? "flex" : "none")}}>
          <span>شنبه تا جمعه</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z"/></g></svg>
        </div>
      </div>

      <div className="weekDay" style={{display: tekrarDisplay}}>
        <input type="checkbox" id="wDN0" className="customCheckBoxInput" value="0" {...register("repeatDays")}/> <label htmlFor="wDN0" className="CheckButton Br8 CheckButtonSize CheckButtonMipiboy"> <span>ش</span> </label>
        <input type="checkbox" id="wDN1" className="customCheckBoxInput" value="1" {...register("repeatDays")}/> <label htmlFor="wDN1" className="CheckButton Br8 CheckButtonSize CheckButtonMipiboy"> <span>ی</span> </label>
        <input type="checkbox" id="wDN2" className="customCheckBoxInput" value="2" {...register("repeatDays")}/> <label htmlFor="wDN2" className="CheckButton Br8 CheckButtonSize CheckButtonMipiboy"> <span>د</span> </label>
        <input type="checkbox" id="wDN3" className="customCheckBoxInput" value="3" {...register("repeatDays")}/> <label htmlFor="wDN3" className="CheckButton Br8 CheckButtonSize CheckButtonMipiboy"> <span>س</span> </label>
        <input type="checkbox" id="wDN4" className="customCheckBoxInput" value="4" {...register("repeatDays")}/> <label htmlFor="wDN4" className="CheckButton Br8 CheckButtonSize CheckButtonMipiboy"> <span>چ</span> </label>
        <input type="checkbox" id="wDN5" className="customCheckBoxInput" value="5" {...register("repeatDays")}/> <label htmlFor="wDN5" className="CheckButton Br8 CheckButtonSize CheckButtonMipiboy"> <span>پ</span> </label>
        <input type="checkbox" id="wDN6" className="customCheckBoxInput" value="6" {...register("repeatDays")}/> <label htmlFor="wDN6" className="CheckButton Br8 CheckButtonSize CheckButtonMipiboy"> <span>ج</span> </label>
      </div>

      <button className="Gray Medium Pill ButtonMipiboy" type="submit" style={{marginTop: "12px"}} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6v12m6-6H6"/></svg>
        <span>افزودن</span>
      </button>
    </form>
    </div>
  );
};
export default AddTaskForm;