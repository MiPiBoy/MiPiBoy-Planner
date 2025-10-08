import SpotlightCard from './SpotlightCard';

const ContentsSections = () => {
    return (
        
        <div className="parent">
            <div className="contents contents-300">
                <SpotlightCard className='box'>300</SpotlightCard>
            </div>
            <div className="contents contents-100-1">
                <SpotlightCard className='box'>100</SpotlightCard>
            </div>
            <div className="contents contents-100-2">
                <SpotlightCard className='box'>100</SpotlightCard>
            </div>
            <div className="contents contents-400">
                <SpotlightCard className='box'>400</SpotlightCard>
            </div>
        </div>
        );
}

export default ContentsSections;