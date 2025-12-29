import cron from 'node-cron';
import { FinService } from "./finservice.js";

const finService = new FinService();
//const quote = await finService.call_quote('IBM');

const now = new Date()
const nowOneMBefor = new Date(now.getTime() - 60000).toUTCString()
const nowTwoMBefor = new Date(now.getTime() - 120000).toUTCString()

const res = await finService.call_chart('IBM', nowTwoMBefor, nowOneMBefor);
// console.log(res.meta.currentTradingPeriod)

finService.call_bs_quarterly()

//const quote = await finService.call_quote('IBM');

// cron.schedule('* * * * *', async () => {
//     try {
        
//         // console.log("Current quote:", quote);
//     } catch (err) {
//         console.error("Error:", err);
//     }
// });