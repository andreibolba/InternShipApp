import { GroupChatMessage } from "./groupchatmessage.model";
import { Person } from "./person.model";

export class GroupChat{
  public groupChatId:number;
  public groupChatName:string;
  public groupChatDescription:string | null;
  public adminId:number;
  public admin:Person;
  public participants:Person[];

  constructor(){
    this.groupChatId = -1;
    this.groupChatName = '';
    this.groupChatDescription = null;
    this.adminId = -1;
    this.admin = new Person();
    this.participants = [];
  }
}