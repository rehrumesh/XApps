using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http.Cors;
using System.Web.Mvc;
using XApps.WebApi.Models;
using XApps.WebApi.DataContext;

namespace XApps.WebApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserAppsController : Controller
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET: /UserApps/
        public ActionResult Index()
        {
            var userapps = db.UserApps.Include(u => u.App).Include(u => u.User);
            return View(userapps.ToList());
        }

        // GET: /UserApps/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserApp userapp = db.UserApps.Find(id);
            if (userapp == null)
            {
                return HttpNotFound();
            }
            return View(userapp);
        }

        // GET: /UserApps/Create
        public ActionResult Create()
        {
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName");
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName");
            return View();
        }

        // POST: /UserApps/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include="UserID,AppID")] UserApp userapp)
        {
            if (ModelState.IsValid)
            {
                db.UserApps.Add(userapp);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", userapp.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", userapp.UserID);
            return View(userapp);
        }

        // GET: /UserApps/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserApp userapp = db.UserApps.Find(id);
            if (userapp == null)
            {
                return HttpNotFound();
            }
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", userapp.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", userapp.UserID);
            return View(userapp);
        }

        // POST: /UserApps/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="UserID,AppID")] UserApp userapp)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userapp).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", userapp.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", userapp.UserID);
            return View(userapp);
        }

        // GET: /UserApps/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserApp userapp = db.UserApps.Find(id);
            if (userapp == null)
            {
                return HttpNotFound();
            }
            return View(userapp);
        }

        // POST: /UserApps/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            UserApp userapp = db.UserApps.Find(id);
            db.UserApps.Remove(userapp);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
