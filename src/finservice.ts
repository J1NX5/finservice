import YahooFinance from "yahoo-finance2";
import { DatabaseService } from "./dbservice.js";
import * as fs from 'fs';
import * as yaml from 'js-yaml';

interface StockData {
    symbol: string;
    date: number;
    high: number;
    volume: number;
    open: number;
    low: number;
    close: number;
}

export class FinService {

    private yahooFinance: InstanceType<typeof YahooFinance>;
    private now: Date = new Date()
    private nowUTCString: String= this.now.toUTCString()
    private days8Befor: String = new Date(this.now.getTime() - 8 * 24 * 60 * 60 * 1000).toUTCString()
    private yamlData: string[] = []
    private dbsObj: DatabaseService = new DatabaseService();

    constructor(){
        this.yahooFinance = new YahooFinance();
    }

    public async initialProcess(){
        this.yamlData = this.loadYamlFile('./symbols.yaml');
        for(const symb of this.yamlData){
            const result = await this.call_chart(symb, this.days8Befor as string, this.nowUTCString as string, '1m')
            for(const elem of result.quotes){
                console.log(elem)
                const data : StockData = { 
                    symbol: symb,
                    date: elem.date.getTime() / 1000,
                    high: elem.high ?? 0,
                    volume: elem.volume ?? 0,
                    open: elem.open ?? 0,
                    low: elem.low ?? 0,
                    close: elem.close ?? 0
                }
                this.dbsObj.insertStockData(data)
            }
        }
    }

    private loadYamlFile(filePath: string) {
        try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(fileContents) as { symbols: string[] };
            return data.symbols
        } catch (error) {
            console.error("Error", error);
            throw error;
        }
    }


    async call_quote(symbol: string){
        const quote = await this.yahooFinance.quote(symbol);
        console.log(quote)
    }

    // periods must have this format: '2023-01-01'
    async call_chart(symbol:string, start_period1:string, end_period2:string, interv: any){
        const result = await this.yahooFinance.chart(symbol, {
            period1: start_period1,
            period2: end_period2,
            interval: interv
        });
        return result
    }

    async fill_chart_data(symbol:string){
        this.yamlData = this.loadYamlFile('./symbols.yaml');
        for(const symb of this.yamlData){
            this.dbsObj.get_last_datetime_of_symbol(symb)
                .then(async (last_date) => {
                    let start_period1: string;
                    if (last_date) {
                        const lastDateObj = new Date((last_date * 1000)+1);
                        let start_period1 = lastDateObj.toUTCString();
                        console.log(`${start_period1} ${this.nowUTCString}`);
                        let result = await this.call_chart(symb, start_period1, this.nowUTCString as string, '1m')
                        for(const elem of result.quotes){
                            const data : StockData = { 
                                symbol: symb,
                                date: elem.date.getTime() / 1000,
                                high: elem.high ?? 0,
                                volume: elem.volume ?? 0,
                                open: elem.open ?? 0,
                                low: elem.low ?? 0,
                                close: elem.close ?? 0
                            }
                            this.dbsObj.insertStockData(data)
                        }

                    }
                });
        }
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
        console.log(result)
    }
    
    // maybe instead earning
    async call_bs_quarterly(symbol:string){
        const balanceSheetData = await this.yahooFinance.fundamentalsTimeSeries(symbol, {
            period1: '2022-01-01',
            period2: '2025-01-01',
            type: 'quarterly',
            module: 'balance-sheet'
        });
        console.log(balanceSheetData)
    }
}
