import { FinService } from "./finservice.js";

const finService = new FinService();
const symbol: string[] = finService.loadYamlFile('./symbols.yaml');

const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    while(true){
        for(const symb of symbol){
            if(await finService.check_symbol_in_db(symb)){
                console.log(`Run case symbol exist`)
                let last_date = await finService.get_last_datetime_o_s(symb)
                let ldUTCString = new Date(Number(last_date) * 1000 + 1000).toUTCString()
                let now: Date = new Date()
                let nowUTCString: string= now.toUTCString()
                // console.time('call_chart to fill up')
                console.log(`Run call_chart with params 
                    last_date:${last_date}, 
                    ldUTCString:${ldUTCString},
                    now:${now},
                    last_date:${last_date},
                    nowUTCString:${nowUTCString}
                `)
                await finService.call_chart(symb, ldUTCString, nowUTCString, '1m')
                // console.timeEnd('call_chart to fill up')
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
                await finService.call_chart(symb, days8Befor, nowUTCString, '1m')
                // console.timeEnd('call_chart for new data')
            }
            console.log('go sleep 50 sec.')
            await sleep(50000)
        }
        console.log('wait for next round 20 min.')
        await sleep(200000)
    }
})();