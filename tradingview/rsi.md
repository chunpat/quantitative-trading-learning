# rsi 背离信号

```
// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © zhangzhenpeng008

//@version=4
study(title = "RSI 背离" , overlay=false) // 指标命名，overlay=false为开小图

len = input(title='RSI Reriod' ,minval = 1 ,defval=21)
src = input(title='RSI Source' , defval=close)
lbR = input(title='RSI lookback Right' , defval=13)
lbL = input(title='RSI lookback Left' , defval=13)

rangeUpper = 60
rangeLower = 6
plotBull = input(title='plotBull' , defval=true)
plotHiddenBull = false
plotBear = input(title='plotBear' , defval=true)
plotHiddenBear = false

bearColor = color.red
bullColor = color.green
hiddenBullColor = color.rgb(0, 255, 0, 80)
hiddenBearColor = color.rgb(255, 0, 0, 80)
textColor = color.white
noneColor = color.new(color.white,100)

osc = rsi(src, len)


plot(osc, title="RSI", linewidth = 2, color=#8D1699)
hline(50, title="Middle Line", linestyle=hline.style_dotted)
oblevel = hline(70, title='Middle Line',linestyle=hline.style_dotted)
oslevel = hline(30, title='Middle Line',linestyle=hline.style_dotted)
fill(oblevel, oslevel,title='Background',color=#9915ff,transp=90)

plFound = na(pivotlow(osc,lbL,lbR)) ? false: true
phFound = na(pivothigh(osc,lbL,lbR)) ? false: true

_inRange(cond) =>
    bars = barssince(cond == true)
    rangeLower <= bars and bars <= rangeUpper


oscHL = osc[lbR] > valuewhen(plFound,osc[lbR],1) and _inRange(plFound[1])

priceLL = low[lbR] < valuewhen(plFound,low[lbR],1)

bullCond = plotBull and priceLL and oscHL and plFound // 满足多条件

plot(
     plFound ? osc[lbR] : na,
     offset=-lbR,
     title="Regular Bullish",
     linewidth=2,
     color = bullCond ? bullColor : noneColor,
     transp=0
     )

plotshape(
     bullCond ? osc[lbR] : na,
     offset=-lbR,
     title='Regular Bullish Label',
     text=" 买  ",
     style=shape.labelup,
     location=location.absolute,
     color=bullColor,
     textcolor=textColor,
     transp=0
     )

oscLH = osc[lbR] < valuewhen(phFound,osc[lbR],1) and _inRange(phFound[1])

priceHH = high[lbR] > valuewhen(phFound,high[lbR],1)

bearCond = plotBear and priceHH and oscLH and phFound

plot(
     phFound ? osc[lbR] : na,
     offset=-lbR,
     title='Regular Bearish',
     linewidth=2,
     color=(bearCond ? bearColor : noneColor ),
     transp=0
     )

plotshape(
     bearCond ? osc[lbR] : na,
     offset=-lbR,
     title='Regular Bearish Label',
     text=" 卖  ",
     style=shape.labeldown,
     location=location.absolute,
     color=bearColor,
     textcolor=textColor,
     transp=0
     )
```