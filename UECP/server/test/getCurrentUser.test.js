const app = require('../app')
const mongoose = require('mongoose');
const supertest = require('supertest');
require('dotenv').config();

jest.setTimeout(100000);

describe("GET /api/getCurrentUser", () => {
    describe("When API call is made", () => {
        beforeAll(async () => {
            await mongoose.connect(process.env.DB_SRV, {
                useNewUrlParser: true, 
                useUnifiedTopology: true, 
            }).then(()=>{
                console.log('Connected to the Database!')
            }).catch((err) => {
                console.log(err)
            });
        });
        afterAll(done => {
            mongoose.connection.close();
            done();
        });

        it("should return current user info from the database and respond with a status code 200", async () => {
            const response = await supertest(app).get("/api/getCurrentUser");
            expect(response.status).toBe(200);
        });

    });
});