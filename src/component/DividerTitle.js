
import { Divider, Chip } from "@mui/material";
const DividerTitle = ({children,...props}) => (<Divider sx={{ mb: 2, mt : 2 }}><Chip label={children} {...props} /></Divider>)

export default DividerTitle