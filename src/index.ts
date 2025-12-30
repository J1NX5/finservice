import { FinService } from "./finservice.js";

let now: Date = new Date()
let nowUTCString: string= now.toUTCString()
let days8Befor: string = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toUTCString()

const finService = new FinService();

const symbol: string[] = finService.loadYamlFile('./symbols.yaml');

(async () => {
    for(const symb of symbol){
        if(await finService.check_symbol_in_db(symb)){
            let last_date = Number(await finService.get_last_datetime_o_s(symb)|| 0)
            let ldUTCString = new Date(last_date+1).toUTCString();
            await finService.call_chart(symb, ldUTCString, nowUTCString, '1m') 
        } else {
            await finService.call_chart(symb, days8Befor, nowUTCString, '1m')
        }
    }
})();