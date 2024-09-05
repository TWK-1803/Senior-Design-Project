const app = require('../app')
const supertest = require('supertest');
require('dotenv').config();
jest.setTimeout(100000);

describe("GET /api/getTypeOfDeals", () => {
    describe("When api call is made", () => {

        it("should return all categories in json format with status code 200", async () => {
            const response = await supertest(app).get("/api/getTypeOfDeals");
            expect(response.status).toBe(200);
            expect(response._body).not.toBeNull();
        });

    });
});