const app = require('../app')
const mongoose = require('mongoose');
const supertest = require('supertest');
require('dotenv').config();

jest.setTimeout(100000);

describe("GET /api/getSellerInfo", () => {
    describe("given user id as param input", () => {
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
        
        it("should return user info of that user id with status code 200", async () => {
            const response = await supertest(app).get("/api/getSellerInfo/64097f290723e075a72fb89b");
            expect(response.status).toBe(200);
        });
    
        it("should return no user info of a user id that does not exist in the DB with status code 404", async () => {
            const response = await supertest(app).get("/api/getSellerInfo/64097f290723e075a72fb89c");
            expect(response.status).toBe(404);
            expect(response.text).toBe("Not Found");
        });
    });
});