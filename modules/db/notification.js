import react from 'react';
import esp from 'esoftplay';
const SQLiteHelper = esp.mod('lib/sqlite');

class ENotification extends SQLiteHelper {
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

  sql = "CREATE TABLE IF NOT EXISTS '" + ENotification.table + "' (" + this.getSQLFormat() + ")"

  constructor() {
    super();
    this.init(ENotification.table, this.sql)
  }

  insertOrUpdate(notif) {
    notif['notif_id'] = notif.id
    delete notif.id
    this.getRow(null, [ENotification.notif_id], [notif.notif_id], (res) => {
      if (res) {
        this.Update(res.id, notif)
      } else {
        this.Insert(notif)
      }
    })
  }

  setRead(id, status = 2) {
    this.Update(id, { [ENotification.status]: status })
  }

  /* return fieldname */
  getColumn() {
    return [
      ENotification.id,
      ENotification.notif_id,
      ENotification.user_id,
      ENotification.title,
      ENotification.message,
      ENotification.params,
      ENotification.return,
      ENotification.status,
      ENotification.created,
      ENotification.updated,
    ]
  }
}

module.exports = ENotification