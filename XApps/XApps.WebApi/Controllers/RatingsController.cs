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
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RatingsController : Controller
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET: /Ratings/
        public ActionResult Index()
        {
            var ratings = db.Ratings.Include(r => r.App).Include(r => r.User);
            return View(ratings.ToList());
        }

        // GET: /Ratings/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Rating rating = db.Ratings.Find(id);
            if (rating == null)
            {
                return HttpNotFound();
            }
            return View(rating);
        }

        // GET: /Ratings/Create
        public ActionResult Create()
        {
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName");
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName");
            return View();
        }

        // POST: /Ratings/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include="AppID,UserID,Ratings")] Rating rating)
        {
            if (ModelState.IsValid)
            {
                db.Ratings.Add(rating);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", rating.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", rating.UserID);
            return View(rating);
        }

        // GET: /Ratings/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Rating rating = db.Ratings.Find(id);
            if (rating == null)
            {
                return HttpNotFound();
            }
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", rating.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", rating.UserID);
            return View(rating);
        }

        // POST: /Ratings/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="AppID,UserID,Ratings")] Rating rating)
        {
            if (ModelState.IsValid)
            {
                db.Entry(rating).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.AppID = new SelectList(db.Apps, "AppID", "AppName", rating.AppID);
            ViewBag.UserID = new SelectList(db.Users, "UserID", "UserName", rating.UserID);
            return View(rating);
        }

        // GET: /Ratings/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Rating rating = db.Ratings.Find(id);
            if (rating == null)
            {
                return HttpNotFound();
            }
            return View(rating);
        }

        // POST: /Ratings/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Rating rating = db.Ratings.Find(id);
            db.Ratings.Remove(rating);
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
