import { FinService } from "./finservice.js";

const finService = new FinService();

console.time("Initial Process Duration");
await finService.initialProcess()
console.timeEnd("Initial Process Duration");

setInterval( async () => {
    console.time("Filling Chart Data Duration");
    await finService.fill_chart_data();
    console.timeEnd("Filling Chart Data Duration");
}, 1200000);




// const now = new Date()
// const nowUTCString= now.toUTCString()
// const days8Befor = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toUTCString()

//const res = await finService.call_chart('IBM', days8Befor, nowUTCString, '1m');
// console.log(res)

// cron.schedule('* * * * *', async () => {
//     try {
        
//         // console.log("Current quote:", quote);
//     } catch (err) {
//         console.error("Error:", err);
//     }
// });