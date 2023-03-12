import MySql, { Connection, ConnectionConfig } from "mysql";

export class Database {
    private readonly connection: Connection;

    constructor(config: string | ConnectionConfig) {
        this.connection = MySql.createConnection(config)
    }

    query(sql: string, values?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (values) {
                this.connection.query(sql, values, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
            } else {
                this.connection.query(sql, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
            }
        })
    }

    connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    getConnection(): Connection {
        return this.connection;
    }
}