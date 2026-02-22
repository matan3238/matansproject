// נקודת כניסה ל-Vercel Serverless
// מעביר את כל הבקשות לאפליקציית Express

const server = require('../server');

module.exports = async (req, res) => {
  // מחכה לאתחול (מוצרים, משתמשים) לפני טיפול בבקשה
  if (server.initPromise) {
    await server.initPromise;
  }
  return server(req, res);
};
