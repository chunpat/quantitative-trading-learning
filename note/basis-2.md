## 基础2

### 交易所问题

> API接口限制

API接口是有访问频率限制的（例如一秒5次之类的），访问不能过于频繁否则就会报http 429错误，就拒绝访问了（大部分交易所都是报429）。

> 网络超时

交易所宕机，网络故障等引起。

### 容错

这个是最常见的错误，困扰无数萌新，经常策略回测好好的一切正常，为何FMZ实盘跑了一段时间（随时可能触发）实盘就挂掉了~
例如，获取账号，如下:
```
var ticker = exchange.GetTicker()
var newPrice = ticker.Last
```

如果发生了请求超时、网络错误、交易所拔网线、挖断电缆的、熊孩子拉电闸的等等..就会导致GetTicker()函数返回null。此时ticker的值就是null，我再去访问它的Last就会发生程序异常导致策略程序停止。

可改成
```
var ticker = exchange.GetTicker()
if (ticker) {
    var newPrice = ticker.Last
    Log("打印最新价格：", newPrice)
} else {
    // 数据为null，不做操作就不会出问题
}
```

**解决方案**，可以设计个函数处理错误，如FMZ的_C()函数,链接：https://www.fmz.com/api

### 下单额限制

> 下限限制

如在OK的模拟盘，交易对为 LTC_USDT
```
function main() {
    exchange.IO("simulate", true)   // 切换为OKEX交易所的模拟盘
    exchange.Buy(-1, 1)             // 价格是-1，表示下的订单为市价单，数量为1表示下单量是1USDT
}
```
由于交易所一般都有下单金额限制，小于限制的订单是不予报单的（例如币安现货要求每单大于5USDT才可以报单成功）。所以这样下单会报错：

```
错误	Buy(-1, 1): map[code:1 data:[map[clOrdId: ordId: sCode:51020 sMsg:Order amount should be greater than the min available amount. tag:]] msg:]
```

> 上限限制

在合约上、针对某个币种限制最大额

### 期货下单时的方向

|  下单函数   | SetDirection 函数的参数设置方向 | 备注 |
|  ----  | ----  | ----  |
| exchange.Buy  | buy | 买入开多仓 |
| exchange.Buy  | closesell | 买入平空仓 |
| exchange.Sell  | sell | 卖出平空仓 |
| exchange.Sell  | closebuy | 卖出平多仓 |

** 注意 ** ，买入卖出操作之后，由于没成交导致平仓也会出错


### 日志输出

Log打印