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
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserController : ApiController
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET api/User
        public IQueryable GetUsers()
        {
            var UserRe = db.Users.Select(i => new { i.UserID, i.UserName, i.Email, i.Designation, i.Department, i.Contact });
            return UserRe;
        }

        // GET api/User/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(int id)
        {
            var UserRe = db.Users.Select(i => new { i.UserID, i.UserName, i.Email, i.Designation, i.Department, i.Contact });
            var product = UserRe.FirstOrDefault((p) => p.UserID == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        // PUT api/User/5
        public IHttpActionResult PutUser(int id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.UserID)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST api/User
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Add(user);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = user.UserID }, user);
        }

        // DELETE api/User/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.UserID == id) > 0;
        }

        [ActionName("UserByUserName")]
        public IHttpActionResult GetUserByUserName(String UserName)
        {
            var UserRe = db.Users.Select(i => new { i.UserID, i.UserName, i.Email, i.Designation, i.Department, i.Contact });
            var product = UserRe.FirstOrDefault((p) => p.UserName == UserName);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
    }
}