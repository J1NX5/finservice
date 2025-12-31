import { FinService } from "./finservice.js";

const finService = new FinService();
const symbol: string[] = finService.loadYamlFile('./symbols.yaml');
const interval_symbol: number = Number(process.env.INTERVAL_SYMBOL)
const interval_round: number = Number(process.env.INTERVAL_ROUND)

const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    while(true){
        console.log(`Start loop with interval_symbol: ${interval_symbol}, interval_round: ${interval_round}`);
        for(const symb of symbol){
            let count_inserts: number = 0
            let count_errors: number = 0
            if(await finService.check_symbol_in_db(symb)){
                console.log(`Run case symbol exist`)
                let last_date = await finService.get_last_datetime_o_s(symb)
                let ldUTCString = new Date(Number(last_date) * 1000 + 1000).toUTCString()
                let now: Date = new Date()
                let nowUTCString: string= now.toUTCString()
                console.log(`Run call_chart with params 
                    last_date:${last_date}, 
                    ldUTCString:${ldUTCString},
                    now:${now},
                    last_date:${last_date},
                    nowUTCString:${nowUTCString}
                `)
                try {
                    await finService.call_chart(symb, ldUTCString, nowUTCString, '1m')
                    count_inserts += 1
                } catch {
                    count_errors += 1
                }
                
            } else {
                console.log(`Run case symbol not exist`)
                let now: Date = new Date()
                let nowUTCString: string= now.toUTCString()
                let days8Befor: string = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toUTCString()
                // console.time('call_chart for new data')
                console.log(`Run call_chart with params
                    now:${now}, 
                    nowUTCString:${nowUTCString},
                    days8Befor: ${days8Befor}
                `)
                try {
                    await finService.call_chart(symb, days8Befor, nowUTCString, '1m')
                    count_inserts += 1
                } catch {
                    count_errors += 1
                }
                
                // console.timeEnd('call_chart for new data')
            }
            console.log(`Round for Symbol:${symb}, Inserts:${count_inserts}, Errors: ${count_errors}`)
            console.log(`go sleep ${interval_symbol/1000} sec.`)
            await sleep(interval_symbol)
        }
        console.log(`wait for next round ${interval_round/1000/60} min.`)
        await sleep(interval_round)
    }
})();