// 

import react from 'react';
import { esp } from 'esoftplay';
const LibSqlite  = esp.mod('lib/sqlite');

export default class enotification extends LibSqlite {
  /* tablename */
  static table = 'notification'

  /* fieldname */
  static id = 'id'
  static notif_id = 'notif_id'
  static user_id = "user_id"
  static title = "title";
  static message = "message";
  static params = "params";
  static return = "return";
  static status = "status";
  static created = "created";
  static updated = "updated";

  sql = "CREATE TABLE IF NOT EXISTS '" + enotification.table + "' (" + this.getSQLFormat() + ")"

  constructor() {
    super();
    this.init(enotification.table, this.sql)
  }

  insertOrUpdate(notif: any) {
    notif['notif_id'] = notif.id
    delete notif.id
    this.getRow(null, [enotification.notif_id], [notif.notif_id], (res) => {
      if (res) {
        this.Update(res.id, notif)
      } else {
        this.Insert(notif)
      }
    })
  }

  setRead(id: number, status: number = 2) {
    this.Update(id, { [enotification.status]: status })
  }

  /* return fieldname */
  getColumn() {
    return [
      enotification.id,
      enotification.notif_id,
      enotification.user_id,
      enotification.title,
      enotification.message,
      enotification.params,
      enotification.return,
      enotification.status,
      enotification.created,
      enotification.updated,
    ]
  }
}