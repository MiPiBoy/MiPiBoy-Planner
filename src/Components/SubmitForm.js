import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

const dateRegex = new RegExp(
  `^(` +
    `|` +
    `([1-9]|[12][0-9]|3[01])` + // فقط روز
    `|([1-9]|[12][0-9]|3[01])/([1-9]|1[0-2])` + // روز/ماه
    `|([1-9]|[12][0-9]|3[01])/([1-9]|1[0-2])/([1-9][0-9]{3})` + // روز/ماه/سال
  `)$`
);

const timeRegex = /^$|^([01]?[0-9]|2[0-3])(:[0-5]?[0-9])?$/;

const SubmitForm = () => {

  const schema = yup.object().shape({
    name : yup.string().required("فیلد نام اجباری است"),
    description : yup.string(),
    data : yup.string().matches(dateRegex, "تاریخ معتبر نیست"),
    time : yup.string().matches(timeRegex, "زمان معتبر نیست"),
  })

  const [dataDisplay, setDataDisplay] = useState("none")
  const [timeDisplay, setTimeDisplay] = useState("none")
  const [datalableDisplay, setDataLableDisplay] = useState("flex")
  const [timeLableDisplay, setTimeLableDisplay] = useState("flex")


  const { register, handleSubmit, formState:{errors} } = useForm({resolver: yupResolver(schema)});

  const onFormSubmit = (data) => {
    console.log(data);
    console.log(`تسک ${data.name} افزوده شد`)
    alert(`تسک ${data.name} افزوده شد`)
  };
  return (
    <div style={{width: "100%", gap: "24px",display: "flex",flexDirection: "column"}}>
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
        <label class="switch">
            <input type="checkbox"/>
            <span class="slider"/>
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
      <input style={{display: dataDisplay}} className="formInput" type="text" placeholder="تاریخ" {...register("data")} />
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
      
      <button className="Gray Medium Pill ButtonMipiboy" type="submit" style={{marginTop: "24px"}} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6v12m6-6H6"/></svg>
        <span>افزودن</span>
      </button>
    </form>
    </div>
  );
};
export default SubmitForm;