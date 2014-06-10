using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using XApps.WebApi.Models;
using XApps.WebApi.DataContext;

namespace XApps.WebApi.Controllers
{
    public class ContributorsController : Controller
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET: /Contributors/
        public ActionResult Index()
        {
            var contributors = db.Contributors.Include(c => c.App).Include(c => c.User);
            return View(contributors.ToList());
        }

        // GET: /Contributors/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Contributor contributor = db.Contributors.Find(id);
            if (contributor == null)
            {
                return HttpNotFound();
            }
            return View(contributor);
        }

        // GET: /Contributors/Create
        public ActionResult Create()
        {
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName");
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName");
            return View();
        }

        // POST: /Contributors/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include="AppID,UserID")] Contributor contributor)
        {
            if (ModelState.IsValid)
            {
                db.Contributors.Add(contributor);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", contributor.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", contributor.UserID);
            return View(contributor);
        }

        // GET: /Contributors/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Contributor contributor = db.Contributors.Find(id);
            if (contributor == null)
            {
                return HttpNotFound();
            }
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", contributor.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", contributor.UserID);
            return View(contributor);
        }

        // POST: /Contributors/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="AppID,UserID")] Contributor contributor)
        {
            if (ModelState.IsValid)
            {
                db.Entry(contributor).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", contributor.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", contributor.UserID);
            return View(contributor);
        }

        // GET: /Contributors/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Contributor contributor = db.Contributors.Find(id);
            if (contributor == null)
            {
                return HttpNotFound();
            }
            return View(contributor);
        }

        // POST: /Contributors/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Contributor contributor = db.Contributors.Find(id);
            db.Contributors.Remove(contributor);
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
