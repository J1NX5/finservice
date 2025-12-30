import cron from 'node-cron';
import { FinService } from "./finservice.js";

const finService = new FinService();
// const check = await finService.check_symbol_in_db('AAPL')
//console.log(check)

console.time("Initial Process Duration");
await finService.initialProcess()
console.timeEnd("Initial Process Duration");

console.time("Filling Chart Data Duration");
await finService.fill_chart_data();
console.timeEnd("Filling Chart Data Duration");


//const quote = await finService.call_quote('IBM');

// const now = new Date()
// const nowUTCString= now.toUTCString()
// const days8Befor = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toUTCString()

//const res = await finService.call_chart('IBM', days8Befor, nowUTCString, '1m');
// console.log(res)

// finService.call_bs_quarterly()

//const quote = await finService.call_quote('IBM');

// cron.schedule('* * * * *', async () => {
//     try {
        
//         // console.log("Current quote:", quote);
//     } catch (err) {
//         console.error("Error:", err);
//     }
// });