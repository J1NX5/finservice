import YahooFinance from "yahoo-finance2";

export class FinService {

    private yahooFinance: InstanceType<typeof YahooFinance>;

    constructor(){
        this.yahooFinance = new YahooFinance();
    }

    async call_quote(symbol: string){
        const quote = await this.yahooFinance.quote(symbol);
        return quote
    }

    // periods must have this format: '2023-01-01'
    async call_chart(symbol:string, period1:string, period2:string){
        const result = await this.yahooFinance.chart(symbol, {
            period1: period1,
            period2: period2
        });
    }
    
    async call_quoteSummary(symbol:string){
        const result = await this.yahooFinance.quoteSummary(symbol, {
            modules:[
                'price',
                'summaryDetail',
                'financialData',
                'defaultKeyStatistics'
            ]
        })
        console.log(result)
    }

    async call_earnings(symbol:string){
        const result = await this.yahooFinance.quoteSummary(symbol, {
            modules:[
                "earnings",
                "earningsHistory",
                "earningsTrend"
            ]
        })
        console.log(result.earningsTrend?.trend)
    }
}
