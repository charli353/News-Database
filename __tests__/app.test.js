const request = require('supertest')
const app = require("../db/app");
const seed = require('../db/seeds/seed')
const db = require("../db/connection")
const endPoints = require('../endpoints.json')



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

describe("CORE: GET - /api", () => {
  test("200: Endpoint should contain an object with all endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject(endPoints)
        });
    });

})

describe("CORE: GET - /api/articles/:article_id", () => {
  test("200: Endpoint should contain all article objects in with correct ID", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).not.toBe(0)
          body.articles.forEach((obj) => {
            expect(obj).toHaveProperty("article_id", expect.any(Number));
            expect(obj).toHaveProperty("title", expect.any(String)); 
            expect(obj).toHaveProperty("topic", expect.any(String)); 
            expect(obj).toHaveProperty("author", expect.any(String)); 
            expect(obj).toHaveProperty("body", expect.any(String)); 
            expect(obj).toHaveProperty("created_at", expect.any(String)); 
            expect(obj).toHaveProperty("votes", expect.any(Number)); 
            expect(obj).toHaveProperty("article_img_url", expect.any(String)); 
          });
        });
    });
    test('400: Incorrect url parameter input outputs a useful error', () => {
      return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(({body}) => {
        expect(body).toEqual({Error: "400, Bad Request"})
      })
    })
    test('400: ID outside of data range outputs a useful error', () => {
      return request(app)
      .get("/api/articles/8365298364982642")
      .expect(400)
      .then(({body}) => {
        expect(body).toEqual({Error: "400, Invalid ID"})
      })
    })
  })