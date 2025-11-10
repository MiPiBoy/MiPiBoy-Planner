import "../Style/NotFound.css";
import FuzzyText from '../Components/ReadyToUse/FuzzyText.js';
  
export const NotFound = () => {
  return (
    <div className='NotFound'>
    <FuzzyText baseIntensity={0.2}>
      404
    </FuzzyText>
    <FuzzyText baseIntensity={0.2}>
      NotFound
    </FuzzyText>
    </div>
)}