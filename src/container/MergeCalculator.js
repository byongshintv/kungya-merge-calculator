import { useState } from 'react';
import Josa from 'josa-js'
import ChipSelector from "../component/ChipSelector";

import { Box,  Grid, Stack, Typography } from "@mui/material";
import { Card, CardContent, CardMedia } from "@mui/material";
import { TextField, InputAdornment, Switch, Button, IconButton } from "@mui/material";
import { Avatar } from "@mui/material";
import { List, ListItem, ListItemText, ListItemAvatar } from "@mui/material";
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';


import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import GitHubIcon from '@mui/icons-material/GitHub';
import ForestIcon from '@mui/icons-material/Forest';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ContentCutIcon from '@mui/icons-material/ContentCut';





import bgPath from "./bg.avif";

import { blue } from '@mui/material/colors';
import Section, { HidableSection } from '../component/Section';
import DividerTitle from '../component/DividerTitle';
const ItemList = ({ children, sx = {} }) => (
  <List 
    sx={{ 
      bgcolor: 'background.paper', 
      display:'grid', gridTemplateColumns:{sx:'1f',sm:'1fr 1fr'}
      ,...sx
    }}>
    {children}
  </List>
)
const Item = ({ label, value, icon }) => (<ListItem>
  <ListItemAvatar>
    <Avatar sx={{ bgcolor: blue[600] }}>
      {icon}
    </Avatar>
  </ListItemAvatar>
  <ListItemText primary={value} secondary={label} />
</ListItem>)
const numberFormat = (value,unit = "",preventUnit = "") => {
  if(isNaN(value)) return "-"
  return preventUnit + value.toLocaleString() + unit
}
const kungya = {
  prefixes: [
    (name) => `${name}룽`,
    (name) => `햇 ${name}쿵야`,
    (name) => `어린 ${name}쿵야`,
    (name) => `${name}쿵야`,
    (name) => `정령 ${name}쿵야`,
    (name) => `싱싱한 ${name}쿵야`,
    (name) => `찬란한 ${name}쿵야`]
  ,
  datas: [
    {name:"양파",interval:5,limit:2000,init:30},
    {name:"샐러리",interval:5,limit:2000,init:40},
    {name:"배추",interval:5,limit:2000,init:50},
    {name:"블랙베리",interval:5,limit:2000,init:60},
    {name:"브로콜리",interval:10,limit:2000,init:70},
    {name:"버섯",interval:10,limit:2500,init:80},
    {name:"비트",interval:10,limit:2500,init:90},
    {name:"멜론",interval:10,limit:2500,init:100},
    {name:"땅콩",interval:10,limit:2500,init:110},
    {name:"바나나",interval:10,limit:2500,init:120},
    {name:"망고",interval:10,limit:3000,init:130},
    {name:"고구마",interval:10,limit:3000,init:140},
    {name:"사과",interval:10,limit:5000,init:500},
    {name:"무",interval:10,limit:3000,init:150},
    {name:"완두",interval:10,limit:3500,init:160},
    {name:"용과"},
    {name:"완계"},
    {name:"라즈베리"},
    {name:"주먹밥"},
  ],
  getAllKungyaNames: function () {
    return this.datas.map(v => v.name)
  },
  getDataByName: function (targetName) {
    let kungyaData = this.datas.find(({name}) => name === targetName)
    return {
      name:"더미", interval:0, limit:0, init:0,
      ...kungyaData
    }
  }
}



const CalculatorForm = ({ formState, onChange }) => {
  let numberFormParams = ({ unit, id }) => ({
    id,
    name: id,
    type: "number",
    InputLabelProps: {
      shrink: true,
    },
    InputProps: {
      endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
    },
    onFocus:e => e.target.select(),
  })
  const { name, cost, hands, goal, goalCount, only5Merge } = formState

  const handleInputChange = ({ target }) => {
    let { name, value, type } = target;
    if (type === "number"){
      value *= 1
      if(value < 0) value *= -1
    }
    onChange({[name]:value})
  }

  const Text = ({ children, ...props }) => (
    <Typography variant="body2" color="text.secondary" {...props}>
      {children}
    </Typography>)
  const FormLabel = ({ children, ...props }) => (
    <Typography variant="body" color="text" {...props}>
      {children}
    </Typography>)

  const {limit:costLimit, interval:costInterval} = kungya.getDataByName(name)
  console.log(kungya.getDataByName(name))
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
    >
      <DividerTitle>데이터 입력</DividerTitle>
      <Section label="쿵야 선택">
        <ChipSelector
          items={kungya.getAllKungyaNames()}
          onSelected={(name) => { 
            const {init:initCost} = kungya.getDataByName(name)
            onChange({name,cost:initCost},{isReset:true}) 
          }}
          selected={name}
          label="쿵야 종류"
        />
        <ItemList>
          <Item icon={<ContentCutIcon />} label={`${name}룽 가격 상한값`} value={ numberFormat(costLimit,"골드") } />
          <Item icon={<TrendingUpIcon />} label={`${name}룽 가격 상승량`} value={ numberFormat(costInterval,"골드") } />
        </ItemList>
        
      </Section>
      <Section label="현재 가격">
        <TextField 
          label={`현재 ${name}룽 가격`}
          onChange={handleInputChange}
          value={cost.toString()}
          {...numberFormParams({ unit: "골드", id: "cost" })}
          disabled={!costInterval}
        />
      </Section>
      <Section label="현재 보유 쿵야">
        <Grid container spacing={2}>
          {

            kungya.prefixes.slice(0, -1).map((prefix, i) => {
              const handleHandsChange = ({ target }) => {
                let { value } = target
                let thisHands = hands.concat();
                if(value < 0) value *= -1
                thisHands[i] = value * 1
                onChange({hands:thisHands})
              }
              return <Grid item xs={6} md={4} key={i}>
                <TextField fullWidth
                  key={i}
                  label={`${prefix(name)} 보유 갯수(Lv.${i})`}
                  value={hands[i].toString()}
                  {...numberFormParams({ unit: "개", id: `hand-${i + 1}` })}
                  onChange={handleHandsChange}
                />
              </Grid>
            })
          }
        </Grid>

      </Section>
      <Section label="목표">
        <ChipSelector
          label={"목표 쿵야"}
          items={
            kungya.prefixes.slice(1).map((prefix, i) => [i + 1, `${prefix(name)}(Lv.${i + 1})`])
          }
          selected={goal}
          onSelected={(key) => { onChange({goal:key}) }}
          sx={{mb:3}}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label={`목표 갯수`}
              onChange={handleInputChange}
              value={goalCount.toString()}
              {...numberFormParams({ unit: "개", id: "goalCount" })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel>머지 방식</FormLabel>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ marginLeft: 2 }}>
                <Text>무지성 5머지</Text>
                <Switch 
                  checked={!only5Merge} onChange={(e, value) => onChange({only5Merge:!value})} 
                  name="only5Merge"
                  inputProps={{'aria-label': "머지 방식에 대한 스위치"}}
                />
                <Text>가장 빠른 획득</Text>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Section>
    </Box>
  )
}

const mergeStratgy = (initParam, params) => {
  const { goal, goalCount, canOverBuy } = initParam // ,hands, canOverBuy
  if (params === undefined) params = { hands: initParam.hands.concat(0), steps: [], buyCount: 0, canOverBuy: false }

  const { hands, steps } = params // ,buyCount
  if (goal === 0) {
    let buyed = goalCount - hands[0]
    params.buyCount += buyed
    hands[0] = goalCount
    steps.push([0, buyed, hands.concat()])
  } else {
    while (true) {
      if (!canOverBuy && goalCount - hands[goal] === 1) {
        mergeStratgy({ goal: goal - 1, goalCount: 3, canOverBuy }, params)
        hands[goal - 1] -= 3
        hands[goal] += 1
        steps.push([goal, 3, hands.concat()])
      } else if (hands[goal] < goalCount) {
        mergeStratgy({ goal: goal - 1, goalCount: 5, canOverBuy: canOverBuy ? canOverBuy : goalCount - hands[goal] > 2 }, params)
        hands[goal - 1] -= 5
        hands[goal] += 2
        steps.push([goal, 5, hands.concat()])
      } else break

    }
  }
  return { steps, buyCount: params.buyCount }
}

  
const getPrice = function({cost,interval,buyCount,limit}){
  let price = 0
  while(--buyCount >= 0){
    if( cost >= limit){
      cost = limit
      price += limit * (buyCount + 1);
      break;
    }
    price += cost;
    cost += interval
  }
  if( limit < cost ) cost = limit
  
  return {lastCost:cost, price}
} 

const CalculatorResult = ({ formState }) => {
  const { name, cost, hands, goal, goalCount, only5Merge } = formState
  
  const {interval, limit} = kungya.getDataByName(name)




  const { steps, buyCount } = mergeStratgy({ hands, goal, goalCount, canOverBuy: only5Merge })
  const {lastCost, price} = getPrice({cost,interval,buyCount,limit})
  

  
  const priceUnits = [
    ['작은 동전', 1],
    ['작은 은화', 4],
    ['작은 금화', 16],
    ['오르카 동전', 55],
    ['오르카 은화', 185],
    ['오르카 금화', 600],
    ['오르카 기념주화', 1900],
    ['금화 주머니', 6000],
    ['금화상자', 18000],
  ]
  function priceToUnit(price){
    for(let [unit,mass] of priceUnits.reverse()){
      if(price < mass) continue
      return {
        unit,
        amount:mass === 0 ? 0 : Math.ceil(price/mass)
      }
    }
    return {
      unit: '-',
      amount:''
    }
  }
  let {unit, amount:unitAmount} = priceToUnit(price)
  let LimitArrivedText = () => <Typography component="span" variant="body2" color="text.secondary"> (상한값)</Typography>
  return (<>
    <Section label={<DividerTitle>계산 결과</DividerTitle>}>
      <ItemList>
        <Item icon={<InventoryIcon />} label={`필요 ${name}룽`} value={`${buyCount.toLocaleString()}개`} />
        <Item icon={<LocalOfferIcon />} label={`${name}룽 최종가격`} value={
          <>
            {numberFormat(lastCost,"골드")}
            {limit === lastCost &&  <LimitArrivedText />}
          </>
          } />
        <Item icon={<PriceCheckIcon />} label={`필요 골드`} value={numberFormat(price,"골드")} />
        <Item icon={<ForestIcon />} label={`필요 재화`} value={numberFormat(unitAmount,"개",unit + " ")} />
      </ItemList>
    </Section>

    <HidableSection
      labelonHide="머지 과정 보기"
      labelonShow="머지 과정 숨기기"
    >
      <CalculatorStepper steps={steps} name={name} limit={300} />
    </HidableSection>
  </>)
}

const CalculatorStepper = ({ steps, name,limit }) => {
  let [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep(activeStep + 1)
  const handleBack = () => setActiveStep(activeStep - 1)
  if( steps.length > limit ){
    return (<Stack direction="row" spacing={2} alignItems="end" justifyContent="center">
      
      <Typography variant="body2" color="text.secondary" > 
      <ErrorOutlineIcon color="text.secondary" />
      머지횟수 {limit}회 초과로 머지과정 확인이 비활성화 되었습니다.</Typography>
    </Stack>)
  }
  return (
    <Stepper orientation="vertical" activeStep={activeStep}>
      {steps.map(([lv, count, hands], index) => {
        let getFullName = (lv) => {
          let prefix = kungya.prefixes[lv]
          if( lv === 0 ) return prefix(name)
          return `${prefix(name)}(Lv.${lv})`
        }

        let description = lv ?
          `${Josa.r(getFullName(lv - 1) || "",'을를')} ${count}머지` :
          `${getFullName(lv)}을 ${count}개 구매`
        let label = description
        let inventory = hands.map((c, i) => `${i === 0 ? "룽" : `Lv.${i}`} ${c}개`).join(", ")
        return <Step key={index}>
          <StepLabel
            optional={<Typography variant="caption">{inventory}</Typography>}
          >
            {label}
          </StepLabel>
          <StepContent>
            <Typography>{description}합니다.</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === steps.length - 1 ? '완료' : '계속'}
                </Button>
                {!activeStep ? "" :
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    뒤로
                  </Button>
                }
              </div>
            </Box>
          </StepContent>
        </Step>
      })}
    </Stepper>)
}

let getDefaultState = () => ({
  name: "양파",
  cost: 100,
  hands: [0, 0, 0, 0, 0, 0],
  goal: 5,
  goalCount: 2,
  only5Merge: true
})
export default function MergeCalculator() {
  const [state, setState] = useState(getDefaultState())

  const handleChange = (ChangedState,{isReset = false} = {}) => {
    setState({
      ...(isReset ? getDefaultState() : state),
      ...ChangedState
    })

  }
  return (
      <Card>
        <CardMedia
          component="img"
          alt="바나나"
          height="150"
          image={bgPath}
        />
        <CardContent>
        <Box sx={{float: 'right'}}>
          <IconButton aria-label="깃허브 링크" component="span" onClick={() => window.location.href = "https://github.com/byongshintv/kungya-merge-calculator"}>
            <GitHubIcon />
          </IconButton>
        </Box>
          <Typography gutterBottom variant="h5" component="div">
            쿵야 머지 비용 계산기
          </Typography>
          <Typography variant="body2" color="text.secondary">
            머지시 사용된 비용을 자동으로 계산 해 줍니다.
          </Typography>
          <CalculatorForm formState={state} onChange={handleChange} />
          <CalculatorResult formState={state} />
        </CardContent>
      </Card>
  );
}
