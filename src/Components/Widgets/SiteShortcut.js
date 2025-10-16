import '../../Style/Button.css'
import shortCutPhoto1 from '../../assets/shortCutPhoto1.png';
import shortCutPhoto2 from '../../assets/shortCutPhoto2.png';
import shortCutPhoto3 from '../../assets/shortCutPhoto3.png';
import shortCutPhoto4 from '../../assets/shortCutPhoto4.png';

const SiteShortcut = () => {

  return (
    <div style={{gap: "24px",display: "flex",flexDirection: "column"}}>
    <div className='titleDiv' style={{paddingInline: "24px"}}>
        <p className='title'>سایت و برنامه ها</p>
        <p className='subtitle'>میانبری به سایت های پر استفاده</p>
    </div>
    <div className='sortCuts'>
        <div className='shortCut'>
            <img src={shortCutPhoto1} className='shortCutPhoto'/>
            <div className='shortCutTitleDiv'>
                <p className='shortCutTitle'>اموزشیار</p>
                <p className='shortCutSubtitle'>صفحه اصلی</p>
            </div>
        </div>
        <div className='shortCut'>
            <img src={shortCutPhoto2} className='shortCutPhoto'/>
            <div className='shortCutTitleDiv'>
                <p className='shortCutTitle'>آیگپ</p>
                <p className='shortCutSubtitle'>صفحه اصلی</p>
            </div>
        </div>
        <div className='shortCut'>
            <img src={shortCutPhoto3} className='shortCutPhoto'/>
            <div className='shortCutTitleDiv'>
                <p className='shortCutTitle'>ایمیل</p>
                <p className='shortCutSubtitle'>صفحه اصلی</p>
            </div>
        </div>
        <div className='shortCut'>
            <img src={shortCutPhoto4} className='shortCutPhoto'/>
            <div className='shortCutTitleDiv'>
                <p className='shortCutTitle'>تلگرام</p>
                <p className='shortCutSubtitle'>صفحه اصلی</p>
            </div>
        </div>
    </div>
    <div className='editButtonDiv' style={{paddingInline: "24px"}}>
        <div className='Gray Medium Pill ButtonMipiboy' style={{width: "100%", boxSizing: "border-box"}} >
            <span>ویرایش</span>    
        </div>
    </div>
    </div>
);
}

export default SiteShortcut;