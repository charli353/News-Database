const request = require('supertest')
const app = require("../db/app");
const seed = require('../db/seeds/seed')
const db = require("../db/connection")

const devData = require('../db/data/test-data/index');


beforeAll(() => {
    return seed(devData)
  });
  
  afterAll(() => {
    db.end()
  });


describe("CORE: GET - /api/topics", () => {
    test("200: Endpoint should contain all topic objects in correct format", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics.length).not.toBe(0)
            body.topics.forEach((obj) => {
              expect(obj).toHaveProperty("slug", expect.any(String));
              expect(obj).toHaveProperty("description", expect.any(String)); 
            });
          });
      });
      test('404: Incorrect url input outputs a useful error', () => {
        return request(app)
        .get("/api/fakepath")
        .expect(404)
      })
})