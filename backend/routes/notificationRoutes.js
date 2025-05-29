import Notification from "../models/notificationModel.js";
import express from "express";
import { verifyToken } from "../models/verifyToken.js";
import User from "../models/user.model.js";
const router = express.Router()


//Create new notification
router.post("/",verifyToken,async(req,res) => {
    const {receiver,type,postId} = req.body
    try {
        if(!receiver || !type){
            return res.status(400).json({ message: 'Receiver and type are required' });
        }
            
        const newNotification = new Notification({
            sender:req.user.id,
            receiver,
            type,
            post: postId
        })

        await newNotification.save()
        res.status(201).json(newNotification)
    } catch (error) {
        console.error('Creating notification failed:', error);
        res.status(500).json({ message: 'Internal Server Error' });        
    }
})

//Get notifications 
router.get('/me', verifyToken, async (req, res) => {
    try {
      const notifications = await Notification.find({ receiver: req.user.id })
        .populate('sender', 'username profilePic')
        .populate({
          path: 'post',
          select: '_id media'
        })
        .sort({ createdAt: -1 });
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Fetching notifications failed:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

//Mart notification as read
router.put('/:id/read',verifyToken,async(req,res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {_id:req.params.id,receiver:req.user.id},
            {isRead:true},
            {new:true}
        )

        if(!notification){
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(notification)
    } catch (error) {
        console.error('Marking notification as read failed:', error);
        res.status(500).json({ message: 'Internal Server Error' });        
    }
})

//Delete notification
router.delete('/:id',verifyToken,async(req,res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id:req.params.id,
            receiver: req.user.id
        })

        if(!notification){
            return res.send(404).json({message:"Notification not found"})
        }

        res.status(200).json({message:"Notification deleted successfully"})
    } catch (error) {
        console.error('Deleting notification failed:', error);
        res.status(500).json({ message: 'Internal Server Error' });        
    }
})
//Mark notifications as all read
router.put('/mark-all-read', verifyToken, async (req, res) => {
    try {
        await Notification.updateMany(
            { receiver: req.user.id, isRead: false },
            { $set: { isRead: true } }
            );
            res.status(200).json({ message: 'All notifications marked as read' });
        } catch (error) {
            console.error('Mark all as read failed:', error);
            res.status(500).json({ message: 'Internal Server Error' });
    }
});
export default router;
