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
    public class FeedbackController : ApiController
    {
        private XAppsDataContext db = new XAppsDataContext();

        // GET api/Feedback
        public IQueryable GetFeedbacks()
        {
            var FeedRe = db.Feedbacks.Select(i => new { i.AppID, i.UserID, i.Feedbacks });
            return FeedRe;
        }

        // GET api/Feedback/5
        [ResponseType(typeof(Feedback))]
        public IHttpActionResult GetFeedback(int id)
        {
            var FeedRe = db.Feedbacks.Select(i => new { i.AppID, i.UserID, i.Feedbacks });
            var feedback = FeedRe.Where((p) => p.AppID == id);
            if (feedback == null)
            {
                return NotFound();
            }
            return Ok(feedback);
        }

        // PUT api/Feedback/5
        public IHttpActionResult PutFeedback(int id, Feedback feedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != feedback.AppID)
            {
                return BadRequest();
            }

            db.Entry(feedback).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedbackExists(id))
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

        // POST api/Feedback
        [ResponseType(typeof(Feedback))]
        public IHttpActionResult PostFeedback(Feedback feedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Feedbacks.Add(feedback);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (FeedbackExists(feedback.AppID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = feedback.AppID }, feedback);
        }

        // DELETE api/Feedback/5
        [ResponseType(typeof(Feedback))]
        public IHttpActionResult DeleteFeedback(int id)
        {
            Feedback feedback = db.Feedbacks.Find(id);
            if (feedback == null)
            {
                return NotFound();
            }

            db.Feedbacks.Remove(feedback);
            db.SaveChanges();

            return Ok(feedback);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FeedbackExists(int id)
        {
            return db.Feedbacks.Count(e => e.AppID == id) > 0;
        }
    }
}