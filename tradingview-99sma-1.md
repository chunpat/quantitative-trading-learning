## 均线确认交易法
```
//@version=4

strategy("GoldGoat-BTC Short-term Price strategy", overlay=true)
//局部变量
anchorMA = 99

basePosition = 12 // 首次建仓开单数量
curCloseAnchorPrice = sma(close, anchorMA) // 当前K线对应的基础局限周期ma close价格
curClosePrice = sma(close, 1) // 当前K线对应的当日close价格 现价


//初始化全局变量
var curPositionState = 0.0 // 1.0为long 2.0为short
var formerCross = 0.0 // 0.0 表示上一个K线没有穿越均线的时刻，1.0表示从下往上穿，2.0表示从上往下穿


//定义回测时间
FromMonth = input(defval = 1, title = "From Month", minval = 1, maxval = 12)
FromDay = input(defval = 1, title = "From Day", minval = 1, maxval = 31)
FromYear = input(defval = 2020, title = "From Year", minval = 2019)
ToMonth = input(defval = 6, title = "To Month", minval = 1, maxval = 12)
ToDay = input(defval = 3, title = "To Day", minval = 1, maxval = 31)
ToYear = input(defval = 2021, title = "To Year", minval = 2020)

start = timestamp(FromYear, FromMonth, FromDay, 00, 00) // backtest start window
finish = timestamp(ToYear, ToMonth, ToDay, 23, 59) // backtest finish window
window() => time >= start and time <= finish ? true : false // create function "within window of time"

//当前K均线上下穿，条件
crossOverCondition = crossover(curClosePrice, curCloseAnchorPrice)
crossUnderCondition = crossunder(curClosePrice, curCloseAnchorPrice)


if window()
    // K线再次破线穿，重置
    if not crossOverCondition and not crossUnderCondition and formerCross > 0.0
        formerCross := 0.0
    
    //当前价格 大于 均线 并且 非做多状态
    if curClosePrice > curCloseAnchorPrice and curPositionState != 1.0
        //标记做多
        curPositionState := 1.0
        strategy.entry("Long", strategy.long, basePosition)
    
    //当前价格 小于 均线 并且 非做空状态
    if curClosePrice < curCloseAnchorPrice and curPositionState != 2.0
        curPositionState := 2.0
        strategy.entry("Short", strategy.short, basePosition)

//上穿
if crossOverCondition
    formerCross := 1.0
//下穿
if crossUnderCondition
    formerCross := 2.0
//现价没有触碰均
if not crossOverCondition and not crossUnderCondition
    formerCross := 0.0

```