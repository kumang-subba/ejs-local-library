const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name

AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = `${this.family_name}, ${this.first_name}`;
  }

  return fullName;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

// Virtual for author's DOB
// AuthorSchema.virtual("dob_formatted").get(function () {
//   return this.date_of_birth
//     ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
//     : "Unavailable";
// });

// Virtual for author's DOD
// AuthorSchema.virtual("dod_formatted").get(function () {
//   return this.date_of_death
//     ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
//     : "Alive";
// });

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
  return (
    (this.date_of_birth
      ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
          DateTime.DATE_MED
        )
      : "Unavailable") +
    "-" +
    (this.date_of_death
      ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
          DateTime.DATE_MED
        )
      : "Alive")
  );
});

AuthorSchema.virtual("dobForForm").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toISODate()
    : "";
});

AuthorSchema.virtual("dodForForm").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toISODate()
    : "";
});
// Export model
module.exports = mongoose.model("Author", AuthorSchema);
