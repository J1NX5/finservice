import * as sqlite3 from 'sqlite3';
import { Database as SQLiteDatabase } from 'sqlite3';

export class Database {

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
}