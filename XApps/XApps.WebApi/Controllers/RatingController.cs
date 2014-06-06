using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using XApps.WebApi.Models;
using XApps.WebApi.DataContext;

namespace XApps.WebApi.Controllers
{
    public class RatingController : ApiController
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET api/Rating
        public IQueryable GetRatings()
        {
            var RatRe = db.Ratings.Select(i => new { i.AppID, i.UserID, i.Ratings });
            return RatRe;
        }

        // GET api/Rating/5
        [ResponseType(typeof(Rating))]
        public IHttpActionResult GetRating(int id)
        {
            var RatRe = db.Ratings.Select(i => new { i.AppID, i.UserID, i.Ratings });
            var ratings = RatRe.FirstOrDefault((p) => p.AppID == id);
            if (ratings == null)
            {
                return NotFound();
            }
            return Ok(ratings);
        }

        // PUT api/Rating/5
        public IHttpActionResult PutRating(int id, Rating rating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != rating.AppID)
            {
                return BadRequest();
            }

            db.Entry(rating).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RatingExists(id))
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

        // POST api/Rating
        [ResponseType(typeof(Rating))]
        public IHttpActionResult PostRating(Rating rating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Ratings.Add(rating);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (RatingExists(rating.AppID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = rating.AppID }, rating);
        }

        // DELETE api/Rating/5
        [ResponseType(typeof(Rating))]
        public IHttpActionResult DeleteRating(int id)
        {
            Rating rating = db.Ratings.Find(id);
            if (rating == null)
            {
                return NotFound();
            }

            db.Ratings.Remove(rating);
            db.SaveChanges();

            return Ok(rating);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RatingExists(int id)
        {
            return db.Ratings.Count(e => e.AppID == id) > 0;
        }
    }
}