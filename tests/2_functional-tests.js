const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function (){

  let id;
  let delId;
  this.timeout(5000)
  suite("POST request to /api/issues/{project}", () => {
    test("Create an issue with every field", (done) => {
      chai.request(server)
      .post("/api/issues/testProject")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title:"title",
        issue_text:"text",
        created_by:"me",
        assigned_to:"myself",
        status_text:"fine"
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isDefined(res.body._id);
        assert.isDefined(res.body.created_on);
        assert.isDefined(res.body.updated_on)
        assert.equal(res.body.issue_title, "title")
        assert.equal(res.body.issue_text, "text")
        assert.equal(res.body.created_by, "me")
        assert.equal(res.body.assigned_to, "myself")
        assert.equal(res.body.status_text, "fine")
        done();
      })
    })
  })

  suite("Create an issue with only required fields", () => {
    test("POST request to /api/issues/testProject", (done) => {
      chai.request(server)
      .post("/api/issues/testProject")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title:"title",
        issue_text:"text",
        created_by:"me"
      })
      .end((err, res) => {
        assert.isDefined(res.body._id);
        assert.isDefined(res.body.created_on);
        assert.isDefined(res.body.updated_on)
        assert.equal(res.body.issue_title, "title")
        assert.equal(res.body.issue_text, "text")
        assert.equal(res.body.created_by, "me")
        assert.equal(res.body.assigned_to, "")
        assert.equal(res.body.status_text, "")
        done()
      })      
    })
  })

  suite("Create an issue with missing required fields", () => {
    test("POST request to /api/issues/testProject", (done) => {
      chai.request(server)
      .post("/api/issues/testProject")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title:"",
        issue_text:"",
        created_by:""
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"error":"required field(s) missing"}`)
        done()
      })      
    })
  })

  suite("View issues on a project", () => {
    test("GET request to /api/issues/{project}", (done) => {
      chai.request(server)
      .get("/api/issues/testProject")
      .end((err, res) => {
        id = res.body[0]._id
        delId = res.body[1]._id;
        assert.equal(res.status, 200)
        assert.isArray(res.body)
        assert.isDefined(res.body[0]._id)
        assert.isDefined(res.body[0].issue_title)
        assert.isDefined(res.body[0].issue_text)
        assert.isDefined(res.body[0].created_on)
        assert.isDefined(res.body[0].updated_on)
        assert.isDefined(res.body[0].created_by)
        assert.isDefined(res.body[0].assigned_to)
        assert.isDefined(res.body[0].open)
        assert.isDefined(res.body[0].status_text)
        done()
      })      
    })
  })

  suite("View issues on a project with one filter", () => {
    test("GET request to /api/issues/{project}", (done) => {
      chai.request(server)
      .get(`/api/issues/testProject?_id=${id}`)
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isArray(res.body)
        assert.equal(res.body[0]._id, id)
        assert.isDefined(res.body[0].issue_title)
        assert.isDefined(res.body[0].issue_text)
        assert.isDefined(res.body[0].created_on)
        assert.isDefined(res.body[0].updated_on)
        assert.isDefined(res.body[0].created_by)
        assert.isDefined(res.body[0].assigned_to)
        assert.isDefined(res.body[0].open)
        assert.isDefined(res.body[0].status_text)
        done()
      })      
    })
  })

  suite("View issues on a project with multiple filters", () => {
    test("GET request to /api/issues/{project}", (done) => {
      chai.request(server)
      .get("/api/issues/testProject?issue_title=title&issue_text=text")
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isArray(res.body)
        assert.isDefined(res.body[0]._id)
        assert.isDefined(res.body[0].issue_title)
        assert.isDefined(res.body[0].issue_text)
        assert.isDefined(res.body[0].created_on)
        assert.isDefined(res.body[0].updated_on)
        assert.isDefined(res.body[0].created_by)
        assert.isDefined(res.body[0].assigned_to)
        assert.isDefined(res.body[0].open)
        assert.isDefined(res.body[0].status_text)
        done()
      })      
    })
  })

  suite("Update one field on an issue", () => {
    test("PUT request to /api/issues/{project}", (done) => {
      chai.request(server)
      .put("/api/issues/apitest")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _id: id,
        issue_title:"titulo"
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"result":"successfully updated","_id":"${id}"}`);
        done()
      })      
    })
  })

  suite("Update multiple fields on an issue", () => {
    test("PUT request to /api/issues/{project}", (done) => {
      chai.request(server)
      .put("/api/issues/apitest")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _id: id,
        issue_title:"titulo",
        issue_text:"texto"
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"result":"successfully updated","_id":"${id}"}`);
        done()
      })      
    })
  })

  suite("Update an issue with missing _id", () => {
    test("PUT request to /api/issues/{project}", (done) => {
      chai.request(server)
      .put("/api/issues/apitest")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _id: "",
        issue_title:"titulo",
        issue_text:"texto"
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"error":"missing _id"}`);
        done()
      })      
    })
  }) 
  
  suite("Update an issue with no fields to update", () => {
    test("PUT request to /api/issues/{project}", (done) => {
      chai.request(server)
      .put("/api/issues/apitest")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _id: id,
        issue_title:"",
        issue_text:"",
        created_by:"",
        assigned_to:"",
        status_text:""
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"error":"no update field(s) sent","_id":"${id}"}`);
        done()                                
      })      
    })
  }) 
  
  suite("Update an issue with an invalid _id", () => {
    test("PUT request to /api/issues/{project}", (done) => {
      chai.request(server)
      .put("/api/issues/testProject")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _id: "1234567",
        issue_title:"title",
        issue_text:"text",
        created_by:"me",
        assigned_to:"myself",
        status_text:"404"
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"error":"could not update","_id":"1234567"}`);
        done()
      })      
    })
  }) 

  suite("Delete an issue", () => {
    test("DELETE request to /api/issues/{project}", (done) => {
      chai.request(server)
      .delete("/api/issues/testProject")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _id: delId
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"result":"successfully deleted","_id":"${delId}"}`);
        done()
      })      
    })
  })   

  suite("Delete an issue with an invalid _id", () => {
    test("DELETE request to /api/issues/{project}", (done) => {
      chai.request(server)
      .delete("/api/issues/testProject")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _id: "123"
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"error":"could not delete","_id":"123"}`);
        done()
      })      
    })
  }) 
  
  suite("Delete an issue with missing _id", () => {
    test("DELETE request to /api/issues/{project}", (done) => {
      chai.request(server)
      .delete("/api/issues/testProject")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _id: ""
      })
      .end((err, res) => {
        assert.equal(JSON.stringify(res.body), `{"error":"missing _id"}`);
        done()
      })      
    })
  })
});
