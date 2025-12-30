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