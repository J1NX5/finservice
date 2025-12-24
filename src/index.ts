import cron from 'node-cron';
import { FinService } from "./finservice.js";

const finService = new FinService();

cron.schedule('* * * * *', async () => {
    try {
        const quote = await finService.call_quote('AAPL');
        console.log("Current quote:", quote);
    } catch (err) {
        console.error("Error:", err);
    }
});