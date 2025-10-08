import SpotlightCard from './SpotlightCard';

const ContentsSections = () => {
    return (
        
        <div class="parent">
            <div class="contents contents-300">
                <SpotlightCard>300</SpotlightCard>
            </div>
            <div class="contents contents-100-1">
                <SpotlightCard>100</SpotlightCard>
            </div>
            <div class="contents contents-100-2">
                <SpotlightCard>100</SpotlightCard>
            </div>
            <div class="contents contents-400">
                <SpotlightCard>400</SpotlightCard>
            </div>
        </div>
        );
}

export default ContentsSections;