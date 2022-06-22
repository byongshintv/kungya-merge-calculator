import { useState } from 'react';

import { Box } from "@mui/material";
import { Divider, Chip } from "@mui/material";

const Section = ({ children, label, ...props }) => (
    <Box sx={{ mb: 1, mt: 1, ml:{sm:1,xs:0}, mr:{sm:1,xs:0}}}>
      <Divider sx={{ marginBottom: 2 }}><Chip label={label} {...props} /></Divider>
      {children}
    </Box>
  )
  
  const HidableSection = ({ children, label, labelonHide, labelonShow, ...props }) => {
    let [isShow, setIsShow] = useState(false);
    if(isShow){
      label = labelonShow || label 
    } else {
      label = labelonHide || label 
    }
    let handleShowSteps = () => setIsShow(!isShow)
    return <Section color={isShow ? "default" : "primary"} label={label} onClick={handleShowSteps} {...props}>
      {isShow && children}
    </Section>
  }

  export {HidableSection}
  export default Section