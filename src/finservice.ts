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

    private yahooFinance: InstanceType<typeof YahooFinance> = new YahooFinance();
    private yamlData: string[] = []
    private dbsObj: DatabaseService = new DatabaseService();

    public async check_symbol_in_db(symbol: string) {
        return await this.dbsObj.check_symbol(symbol);
    }

    public loadYamlFile(filePath: string) {
        try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(fileContents) as { symbols: string[] };
            return data.symbols
        } catch (error) {
            console.error("Error in loadYamlFile", error);
            throw error;
        }
    }
    
    async call_chart(symbol:string, start_period1:string, end_period2:string, interv: any){
        let count_insert: number = 0
        let count_error: number = 0
        try {
            const result = await this.yahooFinance.chart(symbol, {
                period1: start_period1,
                period2: end_period2,
                interval: interv
            });
            for(const elem of result.quotes){
                const data : StockData = { 
                    symbol: symbol,
                    date: elem.date.getTime() / 1000,
                    high: elem.high ?? 0,
                    volume: elem.volume ?? 0,
                    open: elem.open ?? 0,
                    low: elem.low ?? 0,
                    close: elem.close ?? 0
                }
                await this.dbsObj.insertStockData(data)
                count_insert += 1
                }
        } catch (error) {
            count_error += 1
            console.error("Error in call_chart:", error);
        }
        console.log(`call_chart runs for Symbol:${symbol} with inserts:${count_insert} and errors:${count_error}`)
    }

    async get_last_datetime_o_s(symbol: string){
        return await this.dbsObj.get_last_datetime_of_symbol(symbol)
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
}
