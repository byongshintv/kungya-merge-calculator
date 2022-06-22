import { useState } from 'react';

import { Box,Typography } from "@mui/material";
import DividerTitle from './DividerTitle';
const Section = ({ children, label, ...props }) => {
  const Title = () => typeof label === "string" ? <Typography component="h2" variant='h6' sx={{mb:2}}>{label}</Typography>  : label
   return <Box sx={{ mb: 4, mt: 4, ml:{sm:1,xs:0}, mr:{sm:1,xs:0}}}>
      <Title />
      {children}
    </Box>
  }
  
  const HidableSection = ({ children, label, labelonHide, labelonShow, ...props }) => {
    let [isShow, setIsShow] = useState(false);
    if(isShow){
      label = labelonShow || label 
    } else {
      label = labelonHide || label 
    }
    let handleShowSteps = () => setIsShow(!isShow)
    return <Section
        label={<DividerTitle onClick={handleShowSteps} color={isShow ? "default" : "primary"} >{label}</DividerTitle>}
        
       {...props}>
      {isShow && children}
    </Section>
  }

  export {HidableSection}
  export default Section