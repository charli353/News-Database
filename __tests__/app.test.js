const request = require('supertest')
const app = require("../db/app");
const seed = require('../db/seeds/seed')
const db = require("../db/connection")
const endPoints = require('../endpoints.json')
const sorted = require('jest-sorted')



const devData = require('../db/data/test-data/index');



beforeAll(() => {
    return seed(devData)
  });
  
  afterAll(() => {
    db.end()
  });

describe("Invalid URL", () => {
  test('404: Incorrect url input outputs a useful error', () => {
    return request(app)
    .get("/api/fakepath")
    .expect(404)
  })
})
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
  test("200: Endpoint should contain article object with correct ID and comment count", () => {
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
            expect(article).toHaveProperty("comment_count", expect.any(Number)); 

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
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({Error: "404, Invalid ID"})
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


  describe("CORE: GET /api/articles/:comment_id/comments", () => {
    test("200: Endpoint should contain all comments about specific article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((comment) => {
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
          expect(body.comments).toBeSortedBy('created_at', {descending : true})
          });
        });
        test('404: valid ID that doesnt exist outputs useful error message', () => {
          return request(app)
          .get("/api/articles/120/comments")
          .expect(404)
          .then(({body}) => {
            expect(body).toEqual({ Error: 'ID Does Not Exist' })
          })
        })
        test('400: Incorrect url parameter input outputs a useful error message', () => {
          return request(app)
          .get("/api/articles/dog/comments")
          .expect(400)
          .then(({body}) => {
            expect(body).toEqual({Error: "400, Bad Request"})
          })
    })
    test('200: ID with no comments returns empty array.', () => {
      return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({body}) => {
   
        expect(body).toEqual({comments: []})
      })
  })
})

  describe("CORE: GET - /api/articles", () => {
    test("200: Endpoint should contain all article objects except body when query is absent", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).not.toBe(0)
       
            body.articles.forEach((article) => {
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
      test("200: Articles are correctly ordered by default : no query - (Descending by Date Created)", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).not.toBe(0)
            const dates = body.articles.map((article) => {
              return article.created_at
            })        
            expect(dates).toBeSorted({ descending: true })
          });
      });
      test("200: Topic query within endpoint returns articles filtered by specific topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).not.toBe(0)
            body.articles.forEach((article) => {
                expect(article).toHaveProperty("topic", ('mitch'))
            })        
          });
      });
      test("400: Invalid topic query within endpoint returns useful error", () => {
        return request(app)
          .get("/api/articles?topic=faketopic")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({Error: 'Topic does not exist'})
          });
      });
      test("200: Sort_by query within endpoint returns articles sorted by specific column in default order", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body }) => {
          
            expect(body.articles.length).not.toBe(0)
            const ids = body.articles.map((id) => {
              return id.article_id
            })        
            expect(ids).toBeSorted({ descending: true })
          })
        })
        test("404: Invalid sort by query within endpoint returns useful error", () => {
          return request(app)
            .get("/api/articles?sort_by=fakecolumn")
            .expect(404)
            .then(({ body }) => {
              expect(body).toEqual({Error: 'Column Not Found'})
            
            });
        });
        test("200: Sort by query followed by an order query modifies the sort order", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id&order=ASC")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).not.toBe(0)
              const ids = body.articles.map((id) => {
                return id.article_id
              })        
              expect(ids).toBeSorted({ ascending: true })
            });
        });
        test("200: Sort by query followed by an order query modifies the sort order", () => {
          return request(app)
            .get("/api/articles?sort_by=comment_count&order=ASC")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).not.toBe(0)
              const comments = body.articles.map((comment) => {
                return comment.comment_count
              })        
              expect(comments).toBeSorted({ ascending: true })
            });
        });
        test("400: Invalid Order query returns useful error", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id&order=FAKEORDER")
            .expect(400)
            .then(({ body }) => {
              expect(body).toEqual({Error: 'Invalid Order Type'})
   
            });
        });
        test("400: Invalid topic query within endpoint returns useful error", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(404)
            .then(({ body }) => {

              expect(body).toEqual({Error: 'Article does not exist'})
            });
        });
    })
 



   
    

describe("CORE: POST /api/articles/:article_id/comments", () => {
  test("201 : Endpoint displays the inserted comment with correct properties/values", () => {
    const input = {username : 'rogersop', body : 'big comment' }
    return request(app)
      .post("/api/articles/4/comments")
      .send(input)
      .expect(201)
      .then(({body}) => {
          expect(body).toHaveProperty("comment_id", expect.any(Number));
          expect(body).toHaveProperty("votes", (0)); 
          expect(body).toHaveProperty("created_at", expect.any(String)); 
          expect(body).toHaveProperty("author", ('rogersop')); 
          expect(body).toHaveProperty("body", ('big comment')); 
          expect(body).toHaveProperty("article_id", (4)); 
        });
      })
      test("200: Comments are correctly ordered (Descending by Date Created)", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).not.toBe(0)
            const dates = body.comments.map((comment) => {
              return comment.created_at
            })        
            expect(dates).toBeSorted({ descending: true })
          });
      });
      test('Receive 400 error - User doesnt exist on users table', () => {
        const badInput = {username : 'cheeseman', body : 'big comment' }
        return request(app)
            .post("/api/articles/4/comments")
            .send(badInput)
            .expect(404)
            .then(({body}) => {
                expect(body).toEqual({Error: 'User does not Exist'})
            })
            
  })
  test('Receive 400 error - Body requires a string input (not NULL)', () => {
    const badInput2 = {username : 'rogersop', body : null }
    return request(app)
        .post("/api/articles/4/comments")
        .send(badInput2)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({Error : 'Comment requires a text input'})
        })
})
test('404: ID outside of data range outputs a useful error message', () => {
  const input = {username : 'rogersop', body : 'big comment' }
  return request(app)
  .post("/api/articles/8365298364982642/comments")
  .send(input)
  .expect(404)
  .then(({body}) => {
    expect(body).toEqual({Error: "404, Invalid ID"})
  })
})
test('400  -  Incorrect ID input outputs a useful error message', () => {
  const input = {username : 'rogersop', body : 'big comment' }
  return request(app)
      .post("/api/articles/dog/comments")
      .send(input)
      .expect(400)
      .then(({body}) => {
          expect(body).toEqual({Error: "400, Bad Request"})
      })
  })
  test('201  -  Comment object with extra properties is posted without the extra properties', () => {
    const inputLong = {username : 'rogersop', body : 'big comment', newprop : 'delete this' }
    return request(app)
        .post("/api/articles/4/comments")
        .send(inputLong)
        .expect(201)
        .then(({body}) => {
          expect(body).toHaveProperty("comment_id", expect.any(Number));
          expect(body).toHaveProperty("votes", (0)); 
          expect(body).toHaveProperty("created_at", expect.any(String)); 
          expect(body).toHaveProperty("author", ('rogersop')); 
          expect(body).toHaveProperty("body", ('big comment')); 
          expect(body).toHaveProperty("article_id", (4)); 
          expect(body).not.toHaveProperty("newprop"); 
        });
    })
})

describe("CORE: PATCH /api/articles/:article_id", () => {
  beforeEach(() => {
    return seed(devData)
 });
  test("201 : Endpoint displays the updated article with incremented/decremented votes", () => {
    const input = {inc_votes : -20}
    return request(app)
      .patch("/api/articles/4")
      .send(input)
      .expect(200)
      .then(({body}) => {
          expect(body).toHaveProperty("article_id", (4));
          expect(body).toHaveProperty("votes", (-20)); 
          expect(body).toHaveProperty("created_at", expect.any(String));
          expect(body).toHaveProperty("topic", expect.any(String))
          expect(body).toHaveProperty("title", expect.any(String)) 
          expect(body).toHaveProperty("author", expect.any(String)); 
          expect(body).toHaveProperty("article_img_url", expect.any(String)); 
        });
      })
      test('400: Incorrect url parameter input outputs a useful error message', () => {
        const input = {inc_votes : 20}
        return request(app)
        .patch("/api/articles/dog")
        .send(input)
        .expect(400)
        .then(({body}) => {
          expect(body).toEqual({Error: "400, Bad Request"})
        })
      })
      test('400: ID outside of data range outputs a useful error message', () => {
        const input = {inc_votes : 20}
        return request(app)
        .patch("/api/articles/8365298364982642")
        .send(input)
        .expect(404)
        .then(({body}) => {
          expect(body).toEqual({Error: "404, Invalid ID"})
        })
      })
      test('404: valid ID that doesnt exist outputs useful error message', () => {
        const input = {inc_votes : 20}
        return request(app)
        .patch("/api/articles/1000")
        .send(input)
        .expect(404)
        .then(({body}) => {
          expect(body).toEqual({ Error: 'ID Does Not Exist' })
        })
      })
      test('201  -  Votes object with extra properties is patched and incremented without the extra properties', () => {
        const inputLong = {inc_votes: 20, newprop : 'delete this' }
        return request(app)
            .patch("/api/articles/4")
            .send(inputLong)
            .expect(200)
            .then(({body}) => {
              expect(body).toHaveProperty("votes", (20)); 
              expect(body).toHaveProperty("created_at", expect.any(String)); 
              expect(body).toHaveProperty("author", ('rogersop')); 
              expect(body).toHaveProperty("topic", expect.any(String)); 
              expect(body).toHaveProperty("article_img_url", expect.any(String))
              expect(body).toHaveProperty("article_id", (4)); 
              expect(body).not.toHaveProperty("newprop"); 
            });   
        })
        test('Receive 400 error - votes requires a number input (wrong input type)', () => {
          const badInput = {inc_votes : 'nan' }
          return request(app)
              .patch("/api/articles/4")
              .send(badInput)
              .expect(400)
              .then(({body}) => {
                  expect(body).toEqual({Error : '400, Bad Request'})
              })
            })
    })





describe("CORE: DELETE /api/comments/:comment_id", () => {
  test("200: Endpoint should contain deleted comment with correct id", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
  })
  test('400: Incorrect url parameter input outputs a useful error message', () => {
    return request(app)
    .delete("/api/comments/dog")
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({Error: "400, Bad Request"})
    })
  })
  test('400: ID outside of data range outputs a useful error message', () => {
    return request(app)
    .delete("/api/comments/8365298364982642")
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({Error: "404, Invalid ID"})
    })
  })
  test('404: valid ID that doesnt exist outputs useful error message', () => {
    return request(app)
    .delete("/api/comments/1000")
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({ Error: 'ID Does Not Exist' })
    })
  })

})





    describe("CORE: GET - /api/users", () => {
    test("200: Endpoint should contain all user objects in correct format", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length).not.toBe(0)
            body.users.forEach((obj) => {
              expect(obj).toHaveProperty("username", expect.any(String));
              expect(obj).toHaveProperty("name", expect.any(String)); 
              expect(obj).toHaveProperty("avatar_url", expect.any(String));
            });
          });
      });
})

describe("CORE: GET - /api/users/:username", () => {
  test("200: Endpoint should contain correct user object", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body }) => {
        const user = body.user
            expect(user).toHaveProperty("username", ("icellusedkars"));
            expect(user).toHaveProperty("name", ('sam')); 
            expect(user).toHaveProperty("avatar_url", ('https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'));
          });
        });
        test('404: Incorrect url parameter input outputs a useful error message', () => {
          return request(app)
          .get("/api/users/12")
          .expect(404)
          .then(({body}) => {
            expect(body).toEqual({ Error: 'ID Does Not Exist' })
          })
        })
      })

      describe("CORE: POST /api/articles/", () => {
        test("201 : Endpoint displays the inserted article with correct properties/values", () => {
          const input = {title : 'newartcile', topic : 'cats', author : 'rogersop', body : 'hugebody', article_img_url : 'fakelink' }
          return request(app)
            .post("/api/articles")
            .send(input)
            .expect(201)
            .then(({body}) => {

                expect(body).toHaveProperty("votes", (0)); 
                expect(body).toHaveProperty("created_at", expect.any(String)); 
                expect(body).toHaveProperty("title", expect.any(String));
                expect(body).toHaveProperty("author", ('rogersop')); 
                expect(body).toHaveProperty("body", ('hugebody')); 
                expect(body).toHaveProperty("article_id", expect.any(Number)); 
              });
            })
            test('Receive 400 error - User doesnt exist on users table', () => {
              const badInput = {title : 'newartcile', topic : 'cats', author : 'fakeman', body : 'hugebody', article_img_url : 'fakelink' }
              return request(app)
                  .post("/api/articles")
                  .send(badInput)
                  .expect(404)
                  .then(({body}) => {
                      expect(body).toEqual({Error: 'User does not Exist'})
                  })
                  
        })
        test('Receive 400 error - Body requires a string input (not NULL)', () => {
          const badInput2 = {title : 'newartcile', topic : 'cats', author : 'rogersop', body : null, article_img_url : 'fakelink' }
          return request(app)
              .post("/api/articles")
              .send(badInput2)
              .expect(400)
              .then(({body}) => {
                  expect(body).toEqual({Error : 'Comment requires a text input'})
              })
      })
          })
          