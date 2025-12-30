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
                    symbol TEXT NOT NULL,
                    date INTEGER NOT NULL UNIQUE,
                    high REAL NOT NULL,
                    volume INTEGER NOT NULL,
                    open REAL NOT NULL,
                    low REAL NOT NULL,
                    close REAL NOT NULL
                );
            `);
        });
    }

    public get_last_datetime_of_symbol(symbol: string): Promise<number | null> {
        const sql = `
            SELECT MAX(date) AS last_date
            FROM stock_data
            WHERE symbol = ?;
        `;

        return new Promise((resolve, reject) => {
            this.db.get(sql, [symbol], (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row?.last_date ?? null);
                }
            });
        });
    }

    public check_symbol(symbol: string): Promise<boolean | null> {
        const sql = `
            SELECT *
            FROM stock_data
            WHERE symbol = ?;
        `;

        return new Promise((resolve, reject) => {
            this.db.get(sql, [symbol], (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public insertStockData(data: {
        symbol: string,
        date: number;
        high: number;
        volume: number;
        open: number;
        low: number;
        close: number;
    }): void {
        const sql = `
            INSERT INTO stock_data (symbol, date, high, volume, open, low, close)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        this.db.run(
            sql,
            [data.symbol, data.date, data.high, data.volume, data.open, data.low, data.close],
            (err: Error | null) => {
                if (err) {
                    console.error("Error:", err.message);
                }
            }
        );
    }
}