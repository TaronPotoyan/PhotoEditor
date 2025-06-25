import express from "express";
import * as usercontrol from '../controllers/manageUsers'


const route_user = express.Router();

route_user.post('/spec',usercontrol.GetUser);
route_user.post('/',usercontrol.CreateUser);
route_user.patch('/',usercontrol.ResetUser);
route_user.patch('/:key' , usercontrol.ResetProcess);


export default route_user;