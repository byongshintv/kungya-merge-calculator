import { Typography, Box, Chip, Stack} from "@mui/material";

const ChipSelector = ({ items, selected = items[0], onSelected, label}) => {
    if (items.length === 0) return (<Stack></Stack>)
    return (
      <Box sx={{marginBottom:1}}>
        <Typography variant="body2" color="text.secondary" sx={{marginBottom:0.5}}>
          {label}
        </Typography>
          {
            items.map((item, index) => {
              let [key,label] = [item,item];
              if(Array.isArray(item)) [key,label] = item;
              let isSelected = key === selected
              return (<Chip
                key={key} label={label} name={key}
                data-index={index}
                onClick={() => onSelected(key,label,index)} color="primary" variant={isSelected ? "" : "outlined"}
                sx={{margin:0.5}}
              />)
            })
          }
      </Box>)
  }
export default ChipSelector