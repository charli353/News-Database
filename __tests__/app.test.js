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
    test('404: valid ID that doesnt exist outputs useful error message', () => {
      return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({ Error: 'ID Does Not Exist' })
      })
    })
  })

  describe("CORE: GET - /api/articles", () => {
    test("200: Endpoint should contain all article objects except body", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.length).not.toBe(0)
       
            body.forEach((article) => {
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("title", expect.any(String)); 
              expect(article).toHaveProperty("topic", expect.any(String)); 
              expect(article).toHaveProperty("author", expect.any(String)); 
              expect(article).toHaveProperty("created_at", expect.any(String)); 
              expect(article).not.toHaveProperty("body"); 
              expect(article).toHaveProperty("votes", expect.any(Number)); 
              expect(article).toHaveProperty("article_img_url", expect.any(String))
              expect(article).toHaveProperty("comment_count", expect.any(Number));; 
            });
          });
      });
      test("200: Articles are correctly ordered (Descending by Date Created)", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.length).not.toBe(0)
             
              const regex = /([TZ\W])/g
  
              const dateFormat1 = body[0].created_at.replace(regex, " ")
              let arrayDate = dateFormat1.split(" ")

              body.forEach((article) => {
                const currentProperty = article.created_at
                const dateFormat2 = currentProperty.replace(regex, " ")
                const currentDate = dateFormat2.split(" ")

                index = 0
                  currentDate.forEach((num) => {
                    const formatNum =  Number(num)
                
                    expect(formatNum).toBeLessThanOrEqual(Number(arrayDate[index]))

                  })
                arrayDate = currentDate 
            })
          });
      });
      test('404: Incorrect url input outputs a useful error', () => {
        return request(app)
        .get("/api/fakepath")
        .expect(404)
      })
    })
