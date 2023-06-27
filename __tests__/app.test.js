const request = require('supertest')
const app = require("../db/app");
const seed = require('../db/seeds/seed')
const db = require("../db/connection")
const endPoints = require('../endpoints.json')
const sort = require('jest-sorted')


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
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("article_id", (5));
            expect(article).toHaveProperty("title", expect.any(String)); 
            expect(article).toHaveProperty("topic", expect.any(String)); 
            expect(article).toHaveProperty("author", expect.any(String)); 
            expect(article).toHaveProperty("body", expect.any(String)); 
            expect(article).toHaveProperty("created_at", expect.any(String)); 
            expect(article).toHaveProperty("votes", expect.any(Number)); 
            expect(article).toHaveProperty("article_img_url", expect.any(String)); 
          });
        });
    });
    test('400: Incorrect url parameter input outputs a useful error message', () => {
      return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(({body}) => {
        expect(body).toEqual({Error: "400, Bad Request"})
      })
    })
    test('400: ID outside of data range outputs a useful error message', () => {
      return request(app)
      .get("/api/articles/8365298364982642")
      .expect(400)
      .then(({body}) => {
        expect(body).toEqual({Error: "400, Invalid ID"})
      })
    })
    test('400: valid ID that doesnt exist outputs useful error message', () => {
      return request(app)
      .get("/api/articles/1000")
      .expect(400)
      .then(({body}) => {
        expect(body).toEqual({ Error: 'ID Does Not Exist' })
      })
    })
  })


  describe("CORE: GET /api/articles/:comment_id/comments", () => {
    test("200: Endpoint should contain all comments about specific article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          console.log(body)
          body.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number)); 
            expect(comment).toHaveProperty("created_at", expect.any(String)); 
            expect(comment).toHaveProperty("author", expect.any(String)); 
            expect(comment).toHaveProperty("body", expect.any(String)); 
            expect(comment).toHaveProperty("article_id", (1)); 
          });
        });
    });
    test("200: Endpoint should be ordered by creation date (descending)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          
          expect(body).toBeSortedBy('created_at', {descending : true})
          });
        });
        //write error case for 0 results : 404
    });
