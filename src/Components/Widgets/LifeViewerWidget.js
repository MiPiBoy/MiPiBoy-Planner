const LifeViewerWidget = () => {

return (
    <div style={{padding: '14px', height: 'calc(100% - 27px)', zIndex: '100%'}}>    
        <div className='titleDiv'>
            <p className='title'>نمای کل</p>
            <div className="editButton">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.94954 1.9248H17.0495C18.0579 1.9248 18.8829 2.7498 18.8829 3.75814V5.77481C18.8829 6.50814 18.4245 7.42481 17.9662 7.88314L14.0245 11.3665C13.4745 11.8248 13.1079 12.7415 13.1079 13.4748V17.4165C13.1079 17.9665 12.7412 18.6998 12.2829 18.9748L10.9995 19.7998C9.80788 20.5331 8.15788 19.7081 8.15788 18.2415V13.3831C8.15788 12.7415 7.79121 11.9165 7.42454 11.4581L3.94121 7.79147C3.48288 7.33314 3.11621 6.50814 3.11621 5.95814V3.8498C3.11621 2.7498 3.94121 1.9248 4.94954 1.9248Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.0192 1.9248L5.5 9.16647" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </div>
        </div>
    </div>
)}

export default LifeViewerWidget;