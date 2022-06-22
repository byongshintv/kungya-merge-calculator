import MergeCalculator from "./container/MergeCalculator";
import Container from '@mui/material/Container'

function App() {

  return (  <Container maxWidth="md" sx={{mt:{xs:2,sm:6},mb:{xs:2,sm:6}}} >
  <MergeCalculator />
</Container>)
}

export default App;
