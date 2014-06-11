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
    public class AppsController : Controller
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET: /Apps/
        public ActionResult Index()
        {
            var apps = db.Apps.Include(a => a.Category);
            return View(apps.ToList());
        }

        // GET: /Apps/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            App app = db.Apps.Find(id);
            if (app == null)
            {
                return HttpNotFound();
            }
            return View(app);
        }

        // GET: /Apps/Create
        public ActionResult Create()
        {
            ViewBag.CategoryID = new SelectList(db.Categories, "CategoryID", "CategoryName");
            return View();
        }

        // POST: /Apps/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include="AppID,AppName,AuthorID,CategoryID,UserCount,RepoName,LatestHash,isPublished,description")] App app)
        {
            if (ModelState.IsValid)
            {
                db.Apps.Add(app);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CategoryID = new SelectList(db.Categories, "CategoryID", "CategoryName", app.CategoryID);
            return View(app);
        }

        // GET: /Apps/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            App app = db.Apps.Find(id);
            if (app == null)
            {
                return HttpNotFound();
            }
            ViewBag.CategoryID = new SelectList(db.Categories, "CategoryID", "CategoryName", app.CategoryID);
            return View(app);
        }

        // POST: /Apps/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="AppID,AppName,AuthorID,CategoryID,UserCount,RepoName,LatestHash,isPublished,description")] App app)
        {
            if (ModelState.IsValid)
            {
                db.Entry(app).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryID = new SelectList(db.Categories, "CategoryID", "CategoryName", app.CategoryID);
            return View(app);
        }

        // GET: /Apps/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            App app = db.Apps.Find(id);
            if (app == null)
            {
                return HttpNotFound();
            }
            return View(app);
        }

        // POST: /Apps/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            App app = db.Apps.Find(id);
            db.Apps.Remove(app);
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
