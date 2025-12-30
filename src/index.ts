import { FinService } from "./finservice.js";

let now: Date = new Date()
let nowUTCString: string= now.toUTCString()
let days8Befor: string = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toUTCString()

const finService = new FinService();

const symbol: string[] = finService.loadYamlFile('./symbols.yaml');

(async () => {
    
    for(const symb of symbol){
        if(await finService.check_symbol_in_db(symb)){
            let last_date = await finService.get_last_datetime_o_s(symb)
            let ldUTCString = new Date(Number(last_date) * 1000 + 1000).toUTCString()
            console.time('call_chart to fill up')
            await finService.call_chart(symb, ldUTCString, nowUTCString, '1m')
            console.timeEnd('call_chart to fill up')
        } else {
            console.time('call_chart for new data')
            await finService.call_chart(symb, days8Befor, nowUTCString, '1m')
            console.timeEnd('call_chart for new data')
        }
    }
})();