import cron from 'node-cron';
import { FinService } from "./finservice.js";

const finService = new FinService();
const quote = await finService.call_earnings('IBM');

// cron.schedule('* * * * *', async () => {
//     try {
        
//         // console.log("Current quote:", quote);
//     } catch (err) {
//         console.error("Error:", err);
//     }
// });