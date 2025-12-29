import * as sqlite3 from 'sqlite3';
import { Database as SQLiteDatabase } from 'sqlite3';

export class DatabaseService {

    private db: SQLiteDatabase;

    constructor(){
        this.db = new sqlite3.Database(':memory:');
        this.initializeDatabase()
    }

    private initializeDatabase(): void {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE stock_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date DATETIME NOT NULL,
                    high REAL NOT NULL,
                    volume INTEGER NOT NULL,
                    open REAL NOT NULL,
                    low REAL NOT NULL,
                    close REAL NOT NULL
                );
            `);
        });
    }

    public insertStockData(data: {
        date: string;
        high: number;
        volume: number;
        open: number;
        low: number;
        close: number;
    }): void {
        const sql = `
            INSERT INTO stock_data (date, high, volume, open, low, close)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        this.db.run(
            sql,
            [data.date, data.high, data.volume, data.open, data.low, data.close],
            (err: Error | null) => {
                if (err) {
                    console.error("Error:", err.message);
                } else {
                    console.log("Success");
                }
            }
        );
    }
}