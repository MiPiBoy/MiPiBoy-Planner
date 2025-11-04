import shortCutPhoto1 from '../../assets/shortCutPhoto1.png';
import shortCutPhoto2 from '../../assets/shortCutPhoto2.png';
import shortCutPhoto3 from '../../assets/shortCutPhoto3.png';
import shortCutPhoto4 from '../../assets/shortCutPhoto4.png';

const AppsShortcut = () => {

  return (
    <div className='appsShortcut'>
        <div  className='appShort'>
            <img src={shortCutPhoto1} className='shortCutIcon'/>
        </div>
        <div  className='appShort'>
            <img src={shortCutPhoto2} className='shortCutIcon'/>
        </div>
        <div  className='appShort'>
            <img src={shortCutPhoto3} className='shortCutIcon'/>
        </div>
        <div  className='appShort'>
            <img src={shortCutPhoto4} className='shortCutIcon'/>
        </div>
        <div  className='appShort'>
            <img src={shortCutPhoto2} className='shortCutIcon'/>
        </div>
        <div  className='appShort'>
            <img src={shortCutPhoto3} className='shortCutIcon'/>
        </div>
        <div  className='appShort'>
            <img src={shortCutPhoto4} className='shortCutIcon'/>
        </div>
    </div>
);
}

export default AppsShortcut;