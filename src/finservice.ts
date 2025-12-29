import YahooFinance from "yahoo-finance2";
import { DatabaseService } from "./dbservice.js";
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export class FinService {

    private yahooFinance: InstanceType<typeof YahooFinance>;
    private now: Date = new Date()
    private nowUTCString: String= this.now.toUTCString()
    private days8Befor: String = new Date(this.now.getTime() - 8 * 24 * 60 * 60 * 1000).toUTCString()
    private yamlData = this.loadYamlFile('./symbols.yaml');
    private dbsObj: DatabaseService = new DatabaseService();
    
    constructor(){
        this.yahooFinance = new YahooFinance();
        console.log(this.yamlData)
    }

    private loadYamlFile(filePath: string) {
        try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(fileContents);
            return data;
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
