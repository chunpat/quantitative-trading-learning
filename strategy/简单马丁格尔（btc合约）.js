/*
本策略仅供学习使用，用于实盘后果自负 
*/

var n = 0.01 //初始下单数
var MarginLevel = 100 //合约杠杆 
var profit = 20 //期望收益 ，不能小于手续费 


//取随机数 
function getRandom(m, n) {　　
    var num = Math.floor(Math.random() * (m - n) + n);　　
    return num;
}

function main() {
    exchange.SetContractType("swap")  // 永续u合约
    exchange.SetMarginLevel(MarginLevel) // 设置杠杆
    var position = []
    while (true) {
        // {
        //     Info            : {...},     // 请求交易所接口后，交易所接口应答的原始数据，回测时无此属性
        //     MarginLevel     : 10,        // 杆杠大小
        //     Amount          : 100,       // 持仓量，OKEX合约交易所，表示合约的份数(整数且大于1，即合约张数)
        //     FrozenAmount    : 0,         // 仓位冻结量
        //     Price           : 10000,     // 持仓均价
        //     Profit          : 0,         // 持仓浮动盈亏(数据货币单位：BTC/LTC,传统期货单位:RMB,股票不支持此字段,注:OKEX合约全仓情况下指实现盈余,并非持仓盈亏,逐仓下指持仓盈亏)
        //     Type            : 0,         // PD_LONG为多头仓位(CTP中用closebuy_today平仓),PD_SHORT为空头仓位(CTP用closesell_today)平仓,(CTP期货中)PD_LONG_YD为咋日多头仓位(用closebuy平),PD_SHORT_YD为咋日空头仓位(用closesell平)
        //     ContractType    : "quarter", // 商品期货为合约代码,股票为'交易所代码_股票代码',具体参数SetContractType的传入类型
        //     Margin          : 1          // 仓位占用的保证金
        // }
        //     PD_LONG	多头仓位	CTP用exchange.SetDirection("closebuy_today")设置平仓方向，数字货币期货用exchange.SetDirection("closebuy")设置平仓方向	商品期货、数字货币期货	0
        //     PD_SHORT	空头仓位	CTP用exchange.SetDirection("closesell_today")设置平仓方向，数字货币期货用exchange.SetDirection("closesell")设置平仓方向	商品期货、数字货币期货	1
        //     PD_LONG_YD	昨日多头仓位	CTP用exchange.SetDirection("closebuy")设置平仓方向	商品期货	2
        //     PD_SHORT_YD	昨日空头仓位	CTP用exchange.SetDirection("closesell")设置平仓方向	商品期货	3
        position = exchange.GetPosition()  //获取当前持仓

        //未持仓
        if (position.length == 0) { 
            //取随机数0、1作为方向
            var random = getRandom(2, 0)
            Log(random)
            if (random == 0) {
                exchange.SetDirection("sell")
                // -1: 下市价单买入，买入0.1个BTC（计价币）金额的ETH币;  n: 数字货币期货市价单方式下单，下单量参数的单位为合约张数;
                exchange.Sell(-1, n, "开空")
            }
            if (random == 1) {
                exchange.SetDirection("buy")
                exchange.Buy(-1, n, "开多")
            }

        }

        //持仓中
        if (position.length > 0) {
            // 多头仓位
            if (position[0].Type == 0) {
                //盈利大于期望 
                if (position[0].Profit > profit) {
                    exchange.SetDirection("closebuy")
                    //市价卖
                    Log('position',position)
                    exchange.Sell(-1, position[0].Amount,'平多获利,获利量' + position[0].Amount)
                }
                //负盈利大于保证金 则加仓
                if (position[0].Profit < position[0].Margin * -1) {
                    exchange.SetDirection("buy")
                    //加仓
                    Log('position',position)
                    exchange.Buy(-1, position[0].Amount, '开多加仓买入，买入量' + position[0].Amount)
                }
            }

            //空投仓位
            if (position[0].Type == 1) {
                if (position[0].Profit > profit) {
                    exchange.SetDirection("closesell")
                    Log('position',position)
                    exchange.Buy(-1, position[0].Amount, '平空获利,获利量' + position[0].Amount)
                }
                if (position[0].Profit < position[0].Margin * -1) {
                    exchange.SetDirection("sell")
                    Log('position',position)
                    exchange.Sell(-1, position[0].Amount, '开空加仓卖出，卖出量' + position[0].Amount)
                }
            }
            //休眠一分钟
            Sleep(60000)
        }
    }

}