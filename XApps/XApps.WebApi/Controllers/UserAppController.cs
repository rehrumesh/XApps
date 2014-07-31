using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using XApps.WebApi.Models;
using XApps.WebApi.DataContext;

namespace XApps.WebApi.Controllers
{
    [EnableCors(origins: "http://localhost:6406", headers: "*", methods: "*")]
    public class UserAppController : ApiController
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET api/UserApp
        public IQueryable GetUserApps()
        {
            var UserAppRe = db.UserApps.Select(i => new { i.UserID, i.AppID });
            return UserAppRe;
        }

        // GET api/UserApp/5
        [ResponseType(typeof(UserApp))]
        public IHttpActionResult GetUserApp(int id)
        {
            var UserAppRe = db.UserApps.Select(i => new { i.UserID, i.AppID });
            var userapp = UserAppRe.Where((p) => p.UserID == id);
            if (userapp == null)
            {
                return NotFound();
            }
            return Ok(userapp);
        }

        // PUT api/UserApp/5
        public IHttpActionResult PutUserApp(int id, UserApp userapp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userapp.UserID)
            {
                return BadRequest();
            }

            db.Entry(userapp).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserAppExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/UserApp
        [ResponseType(typeof(UserApp))]
        public IHttpActionResult PostUserApp(UserApp userapp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserApps.Add(userapp);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (UserAppExists(userapp.UserID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = userapp.UserID }, userapp);
        }

        // DELETE api/UserApp/5
        [ResponseType(typeof(UserApp))]
        public IHttpActionResult DeleteUserApp(int id)
        {
            UserApp userapp = db.UserApps.Find(id);
            if (userapp == null)
            {
                return NotFound();
            }

            db.UserApps.Remove(userapp);
            db.SaveChanges();

            return Ok(userapp);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserAppExists(int id)
        {
            return db.UserApps.Count(e => e.UserID == id) > 0;
        }

        //Get all users of a given appID
        /*
         [ActionName("UsersByAppID")]
         
         public IHttpActionResult GetUsersByApp(int id)
        {
            var UserAppRe = db.UserApps.Select(i => new { i.UserID, i.AppID });
            var userapp = UserAppRe.FirstOrDefault((p) => p.AppID == id);
            if (userapp == null)
            {
                return NotFound();
            }
            return Ok(userapp);
        }
         */
    }
}