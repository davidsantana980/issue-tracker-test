'use strict';

const mongoose = require('mongoose');
const { issueSchema } = require('../mongo.js');
const Issue = mongoose.model('Issue', issueSchema);
// const ObjectId = require('mongodb').ObjectId;

const readOne = (search, options) => {
  let found = Issue.findOne(search, options)
  return found;
}

const readMany = (search, options) => {
  let found = Issue.find(search, options)
  return found;
}

module.exports = function (app) {

  app.get('/api/issues/:project', async (req, res) => {

      let queryParams = { 
        project: req.params.project,
        assigned_to: req.query.assigned_to,
        status_text: req.query.status_text,
        open: req.query.open,
        _id: req.query._id,
        issue_title: req.query.issue_title,
        issue_text: req.query.issue_text,
        created_by: req.query.created_by,
        created_on: req.query.created_on,
        updated_on: req.query.updated_on
      } 
      
      //delete undefined query parameters
      Object.keys(queryParams).forEach(key => queryParams[key] === undefined ? delete queryParams[key] : {});
      
      try{
        let result = await readMany(queryParams, {project: 0});
        return res.json(result)
      }catch(error){
        return res.json(error)
      }
    })
    
    app.post('/api/issues/:project', async (req, res) => {
      let newDate = new Date();
      let doc = {
        project: req.params.project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text, 
        created_on: newDate,
        updated_on: newDate,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to, 
        status_text: req.body.status_text
      }

      try{
        let id = (await Issue.create(doc))._id;
        let result = await readOne({_id: id._id}, {project: 0}).lean();
        return res.json(result)
      }catch(error){
        return res.json ({ error: 'required field(s) missing' });
      }
    })
    
    app.put('/api/issues/:project', async (req, res) => {      
      let updatedItems = {
        project: req.params.project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text, 
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to, 
        status_text: req.body.status_text,
        open: req.body.open
      }

      if(!req.body._id) return res.json({ error: 'missing _id' })

      //delete undefined body parameters
      Object.keys(updatedItems).forEach(key => !updatedItems[key] ? delete updatedItems[key] : {});
      
      //2 items will always be updated; the name of the project and the date of the update. 
      //if no more items were updated, it means no update fields were filled.

      if(Object.entries(updatedItems).length <= 2) return res.json({ error: 'no update field(s) sent', _id: req.body._id })  
      try{
        if(!req.body._id) return res.json({ error: 'missing _id' })  
        await Issue.findByIdAndUpdate(req.body._id, updatedItems, (err, data) => {
          if(!data || err){
            return res.json({ error: "could not update", _id: req.body._id })
          }
          return res.json({ result: 'successfully updated', '_id': req.body._id})
        }).clone();
      }catch(error){
        return 0//console.log(error)
      }
    })
    
    app.delete('/api/issues/:project', async (req, res) => {    
      try{
        if(!req.body._id) return res.json({ error: 'missing _id' })  
        await Issue.findByIdAndDelete(req.body._id, (err,data) => {
          if(!data || err){
            return res.json({ error: 'could not delete', _id: req.body._id });
          }
          return res.json({ result: 'successfully deleted', _id: req.body._id })
        }).clone();
      }catch(error){
        return 0//console.log(error)
      }
    });  
};