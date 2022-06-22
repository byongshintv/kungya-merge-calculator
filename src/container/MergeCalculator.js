import { useState } from 'react';
import ChipSelector from "../component/ChipSelector";

import { Box,  Grid, Stack, Typography } from "@mui/material";
import { Card, CardContent, CardMedia } from "@mui/material";
import { TextField, InputAdornment, Switch, Button, IconButton } from "@mui/material";
import { Avatar } from "@mui/material";
import { List, ListItem, ListItemText, ListItemAvatar } from "@mui/material";

import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import GitHubIcon from '@mui/icons-material/GitHub';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import bgPath from "./bg.jpg";

import { blue } from '@mui/material/colors';
import Section, { HidableSection } from '../component/Section';
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
  names: {
    5: ["양파", "샐러리", "배추", "블랙베리"],
    10: ["브로콜리", "버섯", "비트", "땅콩", "바나나", "망고", "고구마", "사과", "무", "완두"],
    "-": ["용과", "완계", "라즈베리", "주먹밥"],
  },
  getAllKungyaNames: function () {
    return Object.values(this.names).concat().flat()
  },
  getCostByName: function (targetName) {
    for (let [cost, names] of Object.entries(this.names)) {
      if (names.includes(targetName)) return cost
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
    }
  })
  const { name, cost, hands, goal, goalCount, only5Merge } = formState

  const handleInputChange = ({ target }) => {
    let { name, value, type } = target;
    if (type === "number") value *= 1
    onChange(name, value)
  }

  const Text = ({ children, ...props }) => (
    <Typography variant="body2" color="text.secondary" {...props}>
      {children}
    </Typography>)
  const FormLabel = ({ children, ...props }) => (
    <Typography variant="body" color="text" {...props}>
      {children}
    </Typography>)

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
    >
      <Section label="쿵야 선택">
        <ChipSelector
          items={kungya.getAllKungyaNames()}
          onSelected={(key) => { onChange('name', key) }}
          selected={name}
          label="쿵야 종류"
        />

        <Stack direction="row" spacing={2}>
          <TextField fullWidth
            label={`현재 ${name}룽 가격`}
            onChange={handleInputChange}
            value={cost}
            {...numberFormParams({ unit: "골드", id: "cost" })}
          />
          <TextField fullWidth
            id=""
            label={`룽 가격 상승량`}
            disabled={true}
            value={kungya.getCostByName(name)}
            {...numberFormParams({ unit: "골드", id: "interval" })}
            type="text"
          />
        </Stack>
      </Section>
      <Section label="현재 보유 쿵야">
        <Grid container spacing={2}>
          {

            kungya.prefixes.slice(0, -1).map((prefix, i) => {
              const handleHandsChange = ({ target }) => {
                let { value } = target
                let thisHands = hands.concat();
                thisHands[i] = value * 1
                onChange('hands', thisHands)
              }

              return <Grid item xs={6} md={4} key={i}>
                <TextField fullWidth
                  key={i}
                  label={`${prefix(name)} 보유 갯수(Lv.${i})`}
                  value={hands[i]}
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
          onSelected={(key) => { onChange('goal', key) }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label={`목표 갯수`}
              onChange={handleInputChange}
              value={goalCount}
              {...numberFormParams({ unit: "개", id: "goalCount" })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel>머지 방식</FormLabel>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ marginLeft: 2 }}>
                <Text>무지성 5머지</Text>
                <Switch checked={!only5Merge} onChange={(e, value) => onChange('only5Merge', !value)} name="only5Merge" />
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
    params.buyCount += goalCount - hands[0]
    hands[0] = goalCount
    steps.push([0, goalCount, hands.concat()])
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

const CalculatorResult = ({ formState }) => {
  const { name, cost, hands, goal, goalCount, only5Merge } = formState
  const interval = kungya.getCostByName(name)


  const ItemList = ({ children }) => (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
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

  const { steps, buyCount } = mergeStratgy({ hands, goal, goalCount, canOverBuy: only5Merge })
  const lastCost = cost + interval * buyCount
  const price = (cost + (lastCost - interval)) / 2 * buyCount
  return (<>
    <Section label="계산 결과">
      <ItemList>
        <Item icon={<InventoryIcon />} label={`필요 ${name}룽`} value={`${buyCount}개`} />
        <Item icon={<PriceCheckIcon />} label={`필요 골드`} value={isNaN(price) ? "-" : price.toLocaleString() + "골드"} />
        <Item icon={<LocalOfferIcon />} label={`${name}룽 최종가격`} value={isNaN(price) ? "-" : `${lastCost}골드`} />
      </ItemList>
    </Section>

    <HidableSection
      labelonHide="머지 과정 보기"
      labelonShow="머지 과정 숨기기"
    >
      <CalculatorStepper steps={steps} name={name} />
    </HidableSection>
  </>)
}


const CalculatorStepper = ({ steps, name }) => {
  let [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep(activeStep + 1)
  const handleBack = () => setActiveStep(activeStep - 1)
  return (
    <Stepper orientation="vertical" activeStep={activeStep}>
      {steps.map(([lv, count, hands], index) => {
        let prefix = kungya.prefixes[lv]
        let description = lv ?
          `Lv.${lv} ${prefix(name)}를 ${count}머지` :
          `${prefix(name)}을 ${count}개 구매`
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
export default function MergeCalculator() {
  const [state, setState] = useState({
    name: "양파",
    cost: 100,
    hands: [0, 0, 0, 0, 0, 0],
    goal: 5,
    goalCount: 2,
    only5Merge: true
  })

  const handleChange = (key, value) => {
    setState({
      ...state,
      [key]: value
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
