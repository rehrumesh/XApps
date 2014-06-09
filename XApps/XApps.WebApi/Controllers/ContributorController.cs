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
using XApps.Models;
using XApps.DAL;

namespace XApps.WebApi.Controllers
{
    [EnableCors(origins: "http://localhost:6406", headers: "*", methods: "*")]
    public class ContributorController : ApiController
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET api/Contributor
        public dynamic GetContributors()
        {
            var ConRe = db.Contributors.Select(i => new { i.AppID, i.UserID });
            return ConRe;
        }

        // GET api/Contributor/5
        [ResponseType(typeof(Contributor))]
        public IHttpActionResult GetContributor(int id)
        {
            var ConRe = db.Contributors.Select(i => new { i.AppID, i.UserID });
            var contributor = ConRe.FirstOrDefault((p) => p.AppID == id);
            if (contributor == null)
            {
                return NotFound();
            }
            return Ok(contributor);
        }

        // PUT api/Contributor/5
        public IHttpActionResult PutContributor(int id, Contributor contributor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contributor.AppID)
            {
                return BadRequest();
            }

            db.Entry(contributor).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContributorExists(id))
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

        // POST api/Contributor
        [ResponseType(typeof(Contributor))]
        public IHttpActionResult PostContributor(Contributor contributor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Contributors.Add(contributor);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ContributorExists(contributor.AppID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = contributor.AppID }, contributor);
        }

        // DELETE api/Contributor/5
        [ResponseType(typeof(Contributor))]
        public IHttpActionResult DeleteContributor(int id)
        {
            Contributor contributor = db.Contributors.Find(id);
            if (contributor == null)
            {
                return NotFound();
            }

            db.Contributors.Remove(contributor);
            db.SaveChanges();

            return Ok(contributor);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ContributorExists(int id)
        {
            return db.Contributors.Count(e => e.AppID == id) > 0;
        }
    }
}