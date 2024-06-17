const express=require('express')
const router=express.Router()
const Complaint=require('../models/complaint')

///////////create report///////
 
router.post('/report', async(req,res)=>{

try {
    const reportData= req.body
   
    const report= new Complaint(reportData)
    await report.save()
    res.status(200).send(report)

} catch (err) {
    res.status(500).send({error:err.message})
    
}
})

/////////retrive all repoerts/////////
router.get('/report', async (req, res) => {
    try {
      const reports = await Complaint.find({});
      res.status(200).send(reports);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
  /////////////retrive a report with an id//////////////

  router.get('/report/:id', async (req, res) => {
    try {
      const complaint = await Complaint.findById(req.params.id);
  
      if (!complaint) {
        return res.status(404).send({ error: 'Complaint not found' });
      }
  
      res.status(200).send(complaint);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
  ////////////delete report by id////////////
  router.delete('/report/:id', async (req, res) => {
    try {
      const complaint = await Complaint.findByIdAndDelete(req.params.id);
  
      if (!complaint) {
        return res.status(404).send({ error: 'Complaint not found' });
      }
  
      res.status(200).send({ message: 'Complaint deleted successfully', complaint });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
////////////////delete all reprts////////////
router.delete('/report', async (req, res) => {
    try {
      const result = await Complaint.deleteMany({});
  
      if (result.deletedCount === 0) {
        return res.status(404).send({ error: 'No complaints found to delete' });
      }
  
      res.status(200).send({ message: 'All complaints deleted successfully', deletedCount: result.deletedCount });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });


















module.exports=router