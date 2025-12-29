import sqlite3 from 'sqlite3';

export class DatabaseService {

    private db: sqlite3.Database;

    constructor(){
        this.db = new sqlite3.Database('database.db', (err) => {
            if (err) console.error("Error", err.message);
        });
        this.initializeDatabase()
    }

    private initializeDatabase(): void {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS stock_data (
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