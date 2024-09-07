const path = require("path");

require("dotenv").config();

const {
  DATABASE_URL = "postgresql://capstone_tp1g_user:zZWG1tENOJ8FmH4YH41epkjthHsdW2yJ@dpg-crd5v2rtq21c73ctvvv0-a.singapore-postgres.render.com/capstone_tp1g?ssl=true"
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    connection: DATABASE_URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    ssl: {
      rejectUnauthorized: false // This will allow connections without requiring SSL certificates to be valid.
    }
  },

  production: {
    client: "postgresql",
    connection: DATABASE_URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    ssl: {
      rejectUnauthorized: false // This will allow connections without requiring SSL certificates to be valid.
    }
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    useNullAsDefault: true,
  },
};
