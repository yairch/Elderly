import { config } from "./config";
import { MongoClient } from "mongodb";
import { init } from './dbInit'
import * as User from './user'
import * as Elderly from './elderly';
import * as Organization from './organization';
import * as Responsible from './responsible';
import * as Volunteer from './volunteer';
import * as Meeting from './meeting';
import { UserRole } from "../types/user";

init()
// ---------------------------------- USER ---------------------------------

User.insertUser('user1','pass', UserRole.Admin, 'admins');  
User.insertUser('user2', 'pass', UserRole.Responsible, 'responsibles');
User.insertUser('user3', 'pass', UserRole.Volunteer, 'volunteers');
User.insertUser('user4', 'pass', UserRole.Elderly, 'elderlys');

User.getUserByUsername('user1');
User.getUserByUsername('user2');
User.getUserByUsername('user3');
User.getUserByUsername('user4');

User.updateUserPassword('user1', 'pass1');
User.updateUserPassword('user2', 'pass1');
User.updateUserPassword('user3', 'pass1');
User.updateUserPassword('user4', 'pass1');

User.getAllUsers();

//-------------------------------- RESPONSIBLE --------------------------------------
