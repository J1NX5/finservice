import cron from 'node-cron';
import { FinService } from "./finservice.js";

const finService = new FinService();
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